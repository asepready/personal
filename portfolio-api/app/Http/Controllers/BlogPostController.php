<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = BlogPost::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        if (! auth()->check()) {
            $query->where('is_published', true);
        } elseif ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Blog posts retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = BlogPost::with(['user', 'tags'])->find($id);
        if (! $item) {
            return $this->errorResponse('Blog post not found', null, 404);
        }
        if (! auth()->check() && ! $item->is_published) {
            return $this->errorResponse('Blog post not found', null, 404);
        }
        return $this->successResponse($item, 'Blog post retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'excerpt' => 'nullable|string|max:65535',
            'content' => 'required|string|max:16777215',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $data = $validator->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        $item = BlogPost::create($data);
        return $this->successResponse($item->load('user'), 'Blog post created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = BlogPost::find($id);
        if (!$item) {
            return $this->errorResponse('Blog post not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $id,
            'excerpt' => 'nullable|string|max:65535',
            'content' => 'sometimes|string|max:16777215',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('user'), 'Blog post updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = BlogPost::find($id);
        if (!$item) {
            return $this->errorResponse('Blog post not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Blog post deleted successfully');
    }
}
