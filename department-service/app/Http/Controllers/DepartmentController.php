<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Department::query()
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $department = Department::create($this->validateDepartment($request));

        return response()->json($department, 201);
    }

    public function show(Department $department): JsonResponse
    {
        return response()->json($department);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $department->update($this->validateDepartment($request, $department));

        return response()->json($department->fresh());
    }

    public function destroy(Department $department): JsonResponse
    {
        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully.',
        ]);
    }

    private function validateDepartment(Request $request, ?Department $department = null): array
    {
        return $request->validate([
            'name' => [
                $department ? 'sometimes' : 'required',
                'string',
                'max:255',
                Rule::unique('departments', 'name')->ignore($department?->id),
            ],
        ]);
    }
}
