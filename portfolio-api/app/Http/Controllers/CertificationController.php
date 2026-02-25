<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Certification::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Certifications retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Certification::with('user')->find($id);
        if (!$item) {
            return $this->errorResponse('Certification not found', null, 404);
        }
        return $this->successResponse($item, 'Certification retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|string|url|max:512',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = Certification::create($validator->validated());
        return $this->successResponse($item->load('user'), 'Certification created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Certification::find($id);
        if (!$item) {
            return $this->errorResponse('Certification not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'name' => 'sometimes|string|max:255',
            'issuer' => 'sometimes|string|max:255',
            'issue_date' => 'nullable|date',
            'expiration_date' => 'nullable|date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|string|url|max:512',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('user'), 'Certification updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Certification::find($id);
        if (!$item) {
            return $this->errorResponse('Certification not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Certification deleted successfully');
    }
}
