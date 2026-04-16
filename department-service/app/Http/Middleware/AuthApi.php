<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class AuthApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $authorizationHeader = $request->header('Authorization');

        if (! $authorizationHeader) {
            return response()->json([
                'message' => 'Authorization token is required.',
            ], 401);
        }

        try {
            $response = Http::acceptJson()
                ->timeout(config('services.http.timeout', 5))
                ->withHeaders([
                    'Authorization' => $authorizationHeader,
                ])
                ->get(rtrim(config('services.auth_service.url'), '/').'/api/user');
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Authentication service is unavailable.',
            ], 503);
        }

        if ($response->unauthorized()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($response->failed()) {
            return response()->json([
                'message' => 'Authentication service verification failed.',
            ], 502);
        }

        $request->attributes->set('auth_user', $response->json());

        return $next($request);
    }
}
