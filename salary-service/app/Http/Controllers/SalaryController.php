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
            'bonus' => ['required', 'numeric', 'min:0'],
        ]);

        $employee = $this->fetchEmployee($request, (int) $validated['employee_id']);
        if ($employee instanceof JsonResponse) {
            return $employee;
        }

        $position = $this->fetchPosition($request, (int) $employee['position_id']);
        if ($position instanceof JsonResponse) {
            return $position;
        }

        $salary = Salary::create([
            'employee_id' => (int) $validated['employee_id'],
            'bonus' => (float) $validated['bonus'],
            'total_salary' => $this->calculateTotalSalary($position, (float) $validated['bonus']),
        ]);

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
            'bonus' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $employeeId = (int) ($validated['employee_id'] ?? $salary->employee_id);
        $bonus = (float) ($validated['bonus'] ?? $salary->bonus);

        $employee = $this->fetchEmployee($request, $employeeId);
        if ($employee instanceof JsonResponse) {
            return $employee;
        }

        $position = $this->fetchPosition($request, (int) $employee['position_id']);
        if ($position instanceof JsonResponse) {
            return $position;
        }

        $salary->update([
            'employee_id' => $employeeId,
            'bonus' => $bonus,
            'total_salary' => $this->calculateTotalSalary($position, $bonus),
        ]);

        return response()->json($salary->fresh());
    }

    public function destroy(Salary $salary): JsonResponse
    {
        $salary->delete();

        return response()->json([
            'message' => 'Salary deleted successfully.',
        ]);
    }

    private function fetchEmployee(Request $request, int $employeeId): array|JsonResponse
    {
        return $this->fetchRemoteJson(
            $request,
            'employee_service',
            "/api/employees/{$employeeId}",
            'Selected employee does not exist.',
            'Employee service is unavailable.',
        );
    }

    private function fetchPosition(Request $request, int $positionId): array|JsonResponse
    {
        return $this->fetchRemoteJson(
            $request,
            'position_service',
            "/api/positions/{$positionId}",
            'Selected position does not exist.',
            'Position service is unavailable.',
        );
    }

    private function fetchRemoteJson(
        Request $request,
        string $serviceKey,
        string $endpoint,
        string $notFoundMessage,
        string $serviceUnavailableMessage,
    ): array|JsonResponse {
        try {
            $response = Http::acceptJson()
                ->timeout(config('services.http.timeout', 5))
                ->withHeaders($this->authorizationHeaders($request))
                ->get(rtrim(config("services.{$serviceKey}.url"), '/').$endpoint);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => $serviceUnavailableMessage,
            ], 503);
        }

        if ($response->notFound()) {
            return response()->json([
                'message' => $notFoundMessage,
            ], 422);
        }

        if ($response->failed()) {
            return response()->json([
                'message' => 'Downstream service request failed.',
            ], 502);
        }

        return $response->json();
    }

    private function calculateTotalSalary(array $position, float $bonus): float
    {
        return round((float) $position['base_salary'] + $bonus, 2);
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
