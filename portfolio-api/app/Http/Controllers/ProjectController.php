<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Project::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Projects retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Project::with(['user', 'skills'])->find($id);
        if (!$item) {
            return $this->errorResponse('Project not found', null, 404);
        }
        return $this->successResponse($item, 'Project retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug',
            'summary' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'url' => 'nullable|string|url|max:512',
            'repository_url' => 'nullable|string|url|max:512',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $data = $validator->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        $item = Project::create($data);
        return $this->successResponse($item->load('user'), 'Project created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Project::find($id);
        if (!$item) {
            return $this->errorResponse('Project not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug,' . $id,
            'summary' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'url' => 'nullable|string|url|max:512',
            'repository_url' => 'nullable|string|url|max:512',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('user'), 'Project updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Project::find($id);
        if (!$item) {
            return $this->errorResponse('Project not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Project deleted successfully');
    }
}
