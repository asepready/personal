<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Skill::query()->with('category')->orderBy('id');
        if ($request->has('skill_category_id')) {
            $query->where('skill_category_id', $request->get('skill_category_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Skills retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Skill::with('category')->find($id);
        if (!$item) {
            return $this->errorResponse('Skill not found', null, 404);
        }
        return $this->successResponse($item, 'Skill retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'skill_category_id' => 'required|integer|exists:skill_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:skills,slug',
            'level' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $data = $validator->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $item = Skill::create($data);
        return $this->successResponse($item->load('category'), 'Skill created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Skill::find($id);
        if (!$item) {
            return $this->errorResponse('Skill not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'skill_category_id' => 'sometimes|integer|exists:skill_categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:skills,slug,' . $id,
            'level' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('category'), 'Skill updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Skill::find($id);
        if (!$item) {
            return $this->errorResponse('Skill not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Skill deleted successfully');
    }
}
