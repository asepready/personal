<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExperienceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Experience::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Experiences retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Experience::with('user')->find($id);
        if (!$item) {
            return $this->errorResponse('Experience not found', null, 404);
        }
        return $this->successResponse($item, 'Experience retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'company_name' => 'required|string|max:255',
            'position_title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = Experience::create($validator->validated());
        return $this->successResponse($item->load('user'), 'Experience created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Experience::find($id);
        if (!$item) {
            return $this->errorResponse('Experience not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'company_name' => 'sometimes|string|max:255',
            'position_title' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('user'), 'Experience updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Experience::find($id);
        if (!$item) {
            return $this->errorResponse('Experience not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Experience deleted successfully');
    }
}
