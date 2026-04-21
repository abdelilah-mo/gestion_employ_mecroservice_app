<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SalaryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Salary::query()
                ->latest()
                ->paginate($this->perPage($request))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'integer', 'min:1'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        if ($response = $this->ensureEmployeeExists($request, (int) $validated['employee_id'])) {
            return $response;
        }

        $salary = Salary::create($validated);

        return response()->json($salary, 201);
    }

    public function show(Salary $salary): JsonResponse
    {
        return response()->json($salary);
    }

    public function update(Request $request, Salary $salary): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => ['sometimes', 'integer', 'min:1'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
        ]);

        if (array_key_exists('employee_id', $validated)) {
            if ($response = $this->ensureEmployeeExists($request, (int) $validated['employee_id'])) {
                return $response;
            }
        }

        $salary->update($validated);

        return response()->json($salary->fresh());
    }

    public function destroy(Salary $salary): JsonResponse
    {
        $salary->delete();

        return response()->json([
            'message' => 'Salary deleted successfully.',
        ]);
    }

    private function ensureEmployeeExists(Request $request, int $employeeId): ?JsonResponse
    {
        try {
            $response = Http::acceptJson()
                ->timeout(config('services.http.timeout', 5))
                ->withHeaders($this->authorizationHeaders($request))
                ->get(rtrim(config('services.employee_service.url'), '/')."/api/employees/{$employeeId}");
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Employee service is unavailable.',
            ], 503);
        }

        if ($response->notFound()) {
            return response()->json([
                'message' => 'Selected employee does not exist.',
            ], 422);
        }

        if ($response->failed()) {
            return response()->json([
                'message' => 'Downstream service request failed.',
            ], 502);
        }

        return null;
    }

    private function authorizationHeaders(Request $request): array
    {
        return [
            'Authorization' => $request->header('Authorization'),
        ];
    }

    private function perPage(Request $request): int
    {
        return max(1, min($request->integer('per_page', 15), 100));
    }
}
