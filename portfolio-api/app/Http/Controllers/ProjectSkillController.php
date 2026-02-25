<?php

namespace App\Http\Controllers;

use App\Models\ProjectSkill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectSkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = ProjectSkill::query()->with(['project', 'skill'])->orderBy('id');
        if ($request->has('project_id')) {
            $query->where('project_id', $request->get('project_id'));
        }
        if ($request->has('skill_id')) {
            $query->where('skill_id', $request->get('skill_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Project skills retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = ProjectSkill::with(['project', 'skill'])->find($id);
        if (!$item) {
            return $this->errorResponse('Project skill not found', null, 404);
        }
        return $this->successResponse($item, 'Project skill retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer|exists:projects,id',
            'skill_id' => 'required|integer|exists:skills,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = ProjectSkill::create($validator->validated());
        return $this->successResponse($item->load(['project', 'skill']), 'Project skill created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = ProjectSkill::find($id);
        if (!$item) {
            return $this->errorResponse('Project skill not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'project_id' => 'sometimes|integer|exists:projects,id',
            'skill_id' => 'sometimes|integer|exists:skills,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load(['project', 'skill']), 'Project skill updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = ProjectSkill::find($id);
        if (!$item) {
            return $this->errorResponse('Project skill not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Project skill deleted successfully');
    }
}
