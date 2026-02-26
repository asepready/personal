<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    /**
     * Authenticate by username and password; return API token.
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $user = User::where('username', $request->input('username'))->first();

        if (!$user || !$user->password || !Hash::check($request->input('password'), $user->password)) {
            return $this->errorResponse('Kredensial tidak valid', null, 401);
        }

        $user->api_token = Str::random(60);
        $user->save();

        $userPayload = [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'username' => $user->username,
        ];

        return $this->successResponse(
            ['token' => $user->api_token, 'user' => $userPayload],
            'Login berhasil',
            200
        );
    }
}
