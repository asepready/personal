<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PublicContactController extends Controller
{
    /**
     * Submit a contact message (public, no auth).
     * user_id is taken from CONTACT_OWNER_USER_ID or first user.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:65535',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors()->toArray(), 422);
        }

        $userId = env('CONTACT_OWNER_USER_ID');
        if ($userId === null || $userId === '') {
            $owner = User::query()->first();
            $userId = $owner ? $owner->id : null;
        } else {
            $userId = (int) $userId;
            if (! User::where('id', $userId)->exists()) {
                return $this->errorResponse('Contact owner not configured.', null, 503);
            }
        }

        if ($userId === null) {
            return $this->errorResponse('Contact owner not configured.', null, 503);
        }

        $data = $validator->validated();
        $data['user_id'] = $userId;
        $data['is_read'] = false;

        ContactMessage::create($data);

        return $this->successResponse(
            ['message' => 'Message sent successfully.'],
            'Message sent successfully.',
            201
        );
    }
}
