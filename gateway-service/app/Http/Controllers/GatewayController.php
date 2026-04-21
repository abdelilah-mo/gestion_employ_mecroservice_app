<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GatewayController extends Controller
{
    public function employees(Request $request, string $path = ''): JsonResponse
    {
        return $this->forward($request, 'employee_service', $path);
    }

    public function departments(Request $request, string $path = ''): JsonResponse
    {
        return $this->forward($request, 'department_service', $path);
    }

    public function positions(Request $request, string $path = ''): JsonResponse
    {
        return $this->forward($request, 'position_service', $path);
    }

    public function salaries(Request $request, string $path = ''): JsonResponse
    {
        return $this->forward($request, 'salary_service', $path);
    }

    private function forward(Request $request, string $serviceKey, string $path = ''): JsonResponse
    {
        $options = [
            'query' => $request->query(),
        ];

        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            $options['json'] = $request->all();
        }

        try {
            $response = Http::timeout(config('services.http.timeout', 5))
                ->withHeaders($this->headers($request))
                ->send(
                    $request->method(),
                    $this->serviceUrl($serviceKey, '/api/'.ltrim($path, '/')),
                    $options
                );
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => ucfirst(str_replace('_', ' ', $serviceKey)).' is unavailable.',
            ], 503);
        }

        return $this->toJsonResponse($response);
    }

    private function serviceUrl(string $serviceKey, string $path): string
    {
        return rtrim(config("services.{$serviceKey}.url"), '/').$path;
    }

    private function headers(Request $request): array
    {
        return array_filter([
            'Accept' => 'application/json',
            'Authorization' => $request->header('Authorization'),
        ]);
    }

    private function toJsonResponse(HttpResponse $response): JsonResponse
    {
        if ($response->status() === 204) {
            return response()->json(null, 204);
        }

        return response()->json($response->json(), $response->status());
    }
}
