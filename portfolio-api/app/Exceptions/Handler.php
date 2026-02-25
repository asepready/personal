<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     * All responses use OpenAPI ApiError schema: { data, message, errors }.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {
            return $this->apiError(
                $exception->getMessage() ?: 'Validation failed',
                $exception->errors()->toArray(),
                422
            );
        }

        if ($exception instanceof ModelNotFoundException) {
            return $this->apiError('Resource not found', null, 404);
        }

        if ($exception instanceof HttpException) {
            return $this->apiError(
                $exception->getMessage() ?: 'An error occurred',
                null,
                $exception->getStatusCode()
            );
        }

        $statusCode = 500;
        $message = env('APP_DEBUG', false)
            ? $exception->getMessage()
            : 'Internal server error';

        return $this->apiError($message, null, $statusCode);
    }

    /**
     * Return JSON error response matching OpenAPI ApiError schema.
     */
    protected function apiError(string $message, ?array $errors, int $statusCode): JsonResponse
    {
        return response()->json([
            'data' => null,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}
