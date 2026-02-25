<?php

namespace App\Http\Controllers;

use App\Models\PostTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostTagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = PostTag::query()->with(['post', 'tag'])->orderBy('id');
        if ($request->has('blog_post_id')) {
            $query->where('blog_post_id', $request->get('blog_post_id'));
        }
        if ($request->has('tag_id')) {
            $query->where('tag_id', $request->get('tag_id'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Post tags retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = PostTag::with(['post', 'tag'])->find($id);
        if (!$item) {
            return $this->errorResponse('Post tag not found', null, 404);
        }
        return $this->successResponse($item, 'Post tag retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'blog_post_id' => 'required|integer|exists:blog_posts,id',
            'tag_id' => 'required|integer|exists:tags,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = PostTag::create($validator->validated());
        return $this->successResponse($item->load(['post', 'tag']), 'Post tag created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = PostTag::find($id);
        if (!$item) {
            return $this->errorResponse('Post tag not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'blog_post_id' => 'sometimes|integer|exists:blog_posts,id',
            'tag_id' => 'sometimes|integer|exists:tags,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load(['post', 'tag']), 'Post tag updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = PostTag::find($id);
        if (!$item) {
            return $this->errorResponse('Post tag not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Post tag deleted successfully');
    }
}
