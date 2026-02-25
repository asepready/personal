<?php

namespace App\Http\Controllers;

use App\Models\SkillCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SkillCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = SkillCategory::query()->orderBy('id');
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Skill categories retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = SkillCategory::with('skills')->find($id);
        if (!$item) {
            return $this->errorResponse('Skill category not found', null, 404);
        }
        return $this->successResponse($item, 'Skill category retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:skill_categories,slug',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $data = $validator->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $item = SkillCategory::create($data);
        return $this->successResponse($item, 'Skill category created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = SkillCategory::find($id);
        if (!$item) {
            return $this->errorResponse('Skill category not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:skill_categories,slug,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh(), 'Skill category updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = SkillCategory::find($id);
        if (!$item) {
            return $this->errorResponse('Skill category not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Skill category deleted successfully');
    }
}
