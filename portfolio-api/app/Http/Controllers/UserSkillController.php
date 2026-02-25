<?php

namespace App\Http\Controllers;

use App\Models\UserSkill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserSkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = UserSkill::query()->with(['user', 'skill'])->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        if ($request->has('skill_id')) {
            $query->where('skill_id', $request->get('skill_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'User skills retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = UserSkill::with(['user', 'skill'])->find($id);
        if (!$item) {
            return $this->errorResponse('User skill not found', null, 404);
        }
        return $this->successResponse($item, 'User skill retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'skill_id' => 'required|integer|exists:skills,id',
            'proficiency_level' => 'nullable|string|max:100',
            'years_experience' => 'nullable|integer|min:0',
            'is_primary' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = UserSkill::create($validator->validated());
        return $this->successResponse($item->load(['user', 'skill']), 'User skill created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = UserSkill::find($id);
        if (!$item) {
            return $this->errorResponse('User skill not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'skill_id' => 'sometimes|integer|exists:skills,id',
            'proficiency_level' => 'nullable|string|max:100',
            'years_experience' => 'nullable|integer|min:0',
            'is_primary' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load(['user', 'skill']), 'User skill updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = UserSkill::find($id);
        if (!$item) {
            return $this->errorResponse('User skill not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'User skill deleted successfully');
    }
}
