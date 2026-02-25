<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = ContactMessage::query()->with('user')->orderBy('id');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }
        $items = $query->paginate($perPage);
        return $this->successResponse($items, 'Contact messages retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $item = ContactMessage::with('user')->find($id);
        if (!$item) {
            return $this->errorResponse('Contact message not found', null, 404);
        }
        return $this->successResponse($item, 'Contact message retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'is_read' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item = ContactMessage::create($validator->validated());
        return $this->successResponse($item->load('user'), 'Contact message created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = ContactMessage::find($id);
        if (!$item) {
            return $this->errorResponse('Contact message not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|integer|exists:users,id',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'subject' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'is_read' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $item->update($validator->validated());
        return $this->successResponse($item->fresh()->load('user'), 'Contact message updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = ContactMessage::find($id);
        if (!$item) {
            return $this->errorResponse('Contact message not found', null, 404);
        }
        $item->delete();
        return $this->successResponse(null, 'Contact message deleted successfully');
    }
}
