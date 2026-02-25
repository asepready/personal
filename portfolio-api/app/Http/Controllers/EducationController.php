<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Education::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Educations retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Education::with('user')->find($id);
        if (!$item) {
            return $this->errorResponse('Education not found', null, 404);
        }
        return $this->successResponse($item, 'Education retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'institution_name' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = Education::create($validator->validated());
        return $this->successResponse($item->load('user'), 'Education created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Education::find($id);
        if (!$item) {
            return $this->errorResponse('Education not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'institution_name' => 'sometimes|string|max:255',
            'degree' => 'sometimes|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
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
        return $this->successResponse($item->fresh()->load('user'), 'Education updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Education::find($id);
        if (!$item) {
            return $this->errorResponse('Education not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Education deleted successfully');
    }
}
