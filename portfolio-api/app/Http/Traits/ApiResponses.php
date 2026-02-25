<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Support\Arrayable;

/**
 * Standard API response helpers aligned with OpenAPI 3 components/schemas:
 * - ApiResponse (success): data, message, errors (null)
 * - ApiError (errors): data (null), message, errors (nullable)
 */
trait ApiResponses
{
    /**
     * Success response (OpenAPI ApiResponse).
     * Use for 200/201 with single resource or paginated data.
     */
    protected function successResponse($data, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        $payload = [
            'data' => $data,
            'message' => $message,
            'errors' => null,
        ];
        return response()->json($payload, $statusCode);
    }

    /**
     * Error response (OpenAPI ApiError).
     * Use for 400, 404, 422, 500 etc. with consistent shape.
     *
     * @param  array<string, string[]>|null  $errors  Field-to-messages map (e.g. validation errors)
     */
    protected function errorResponse(string $message, $errors = null, int $statusCode = 400): JsonResponse
    {
        $normalizedErrors = $errors instanceof Arrayable
            ? $errors->toArray()
            : (is_array($errors) ? $errors : $errors);

        return response()->json([
            'data' => null,
            'message' => $message,
            'errors' => $normalizedErrors,
        ], $statusCode);
    }
}
