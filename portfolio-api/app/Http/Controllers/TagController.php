<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $items = Tag::query()->orderBy('id')->paginate($perPage);
        return $this->successResponse($items, 'Tags retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = Tag::with('posts')->find($id);
        if (!$item) {
            return $this->errorResponse('Tag not found', null, 404);
        }
        return $this->successResponse($item, 'Tag retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tags,slug',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $data = $validator->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $item = Tag::create($data);
        return $this->successResponse($item, 'Tag created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Tag::find($id);
        if (!$item) {
            return $this->errorResponse('Tag not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tags,slug,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh(), 'Tag updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Tag::find($id);
        if (!$item) {
            return $this->errorResponse('Tag not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Tag deleted successfully');
    }
}
