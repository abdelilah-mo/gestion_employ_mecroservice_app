<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Employee::query()
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateEmployee($request);

        if ($response = $this->ensureDepartmentExists($request, (int) $validated['department_id'])) {
            return $response;
        }

        if ($response = $this->ensurePositionExists($request, (int) $validated['position_id'])) {
            return $response;
        }

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee): JsonResponse
    {
        $validated = $this->validateEmployee($request, $employee);

        if (array_key_exists('department_id', $validated)
            && ($response = $this->ensureDepartmentExists($request, (int) $validated['department_id']))) {
            return $response;
        }

        if (array_key_exists('position_id', $validated)
            && ($response = $this->ensurePositionExists($request, (int) $validated['position_id']))) {
            return $response;
        }

        $employee->update($validated);

        return response()->json($employee->fresh());
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully.',
        ]);
    }

    private function validateEmployee(Request $request, ?Employee $employee = null): array
    {
        return $request->validate([
            'name' => [
                $employee ? 'sometimes' : 'required',
                'string',
                'max:255',
            ],
            'email' => [
                $employee ? 'sometimes' : 'required',
                'string',
                'email',
                'max:255',
                Rule::unique('employees', 'email')->ignore($employee?->id),
            ],
            'department_id' => [
                $employee ? 'sometimes' : 'required',
                'integer',
                'min:1',
            ],
            'position_id' => [
                $employee ? 'sometimes' : 'required',
                'integer',
                'min:1',
            ],
        ]);
    }

    private function ensureDepartmentExists(Request $request, int $departmentId): ?JsonResponse
    {
        return $this->ensureRemoteResourceExists(
            $request,
            'department_service',
            "/api/departments/{$departmentId}",
            'Selected department does not exist.',
            'Department service is unavailable.',
        );
    }

    private function ensurePositionExists(Request $request, int $positionId): ?JsonResponse
    {
        return $this->ensureRemoteResourceExists(
            $request,
            'position_service',
            "/api/positions/{$positionId}",
            'Selected position does not exist.',
            'Position service is unavailable.',
        );
    }

    private function ensureRemoteResourceExists(
        Request $request,
        string $serviceKey,
        string $endpoint,
        string $notFoundMessage,
        string $serviceUnavailableMessage,
    ): ?JsonResponse {
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
                'message' => 'Downstream service validation failed.',
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
}
