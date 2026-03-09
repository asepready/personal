<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ThrottleRequests
{
    /**
     * Handle an incoming request. Limit: max attempts per minute per IP.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int  $maxAttempts  Max requests per minute (default from env THROTTLE_MAX_ATTEMPTS or 60)
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $maxAttempts = null)
    {
        $maxAttempts = (int) ($maxAttempts ?? env('THROTTLE_MAX_ATTEMPTS', 60));
        $decayMinutes = (int) env('THROTTLE_DECAY_MINUTES', 1);
        $window = (int) (time() / ($decayMinutes * 60));
        $key = 'throttle:' . $maxAttempts . ':' . $request->ip() . ':' . $window;

        if (! Cache::has($key)) {
            Cache::put($key, 0, ($decayMinutes * 60) + 10);
        }
        $hits = (int) Cache::increment($key);

        if ($hits > $maxAttempts) {
            return response()->json([
                'data' => null,
                'message' => 'Too many requests.',
                'errors' => null,
            ], 429);
        }

        return $next($request);
    }
}
