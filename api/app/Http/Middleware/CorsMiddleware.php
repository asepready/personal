<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowed = $this->getAllowedOrigins();
        $origin = $request->header('Origin');
        $allowOrigin = $this->resolveOrigin($allowed, $origin);

        if ($request->isMethod('OPTIONS')) {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', $allowOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

        return $response;
    }

    private function getAllowedOrigins(): array
    {
        $origins = env('CORS_ORIGINS', '*');
        if ($origins === '*' || $origins === '') {
            return ['*'];
        }
        return array_map('trim', explode(',', $origins));
    }

    private function resolveOrigin(array $allowed, ?string $requestOrigin): string
    {
        if (in_array('*', $allowed, true)) {
            return '*';
        }
        if ($requestOrigin && in_array($requestOrigin, $allowed, true)) {
            return $requestOrigin;
        }
        return $allowed[0] ?? '*';
    }
}
