<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $users = User::query()->orderBy('id')->paginate($perPage);
        return $this->successResponse($users, 'Users retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }
        return $this->successResponse($user, 'User retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'email_public' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
            'profile_image_url' => 'nullable|string|url|max:512',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $user = User::create($validator->validated());
        return $this->successResponse($user, 'User created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'email_public' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
            'profile_image_url' => 'nullable|string|url|max:512',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $user->update($validator->validated());
        return $this->successResponse($user->fresh(), 'User updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }
        $user->delete();
        return $this->successResponse(null, 'User deleted successfully');
    }
}
