<?php

namespace App\Http\Controllers;
use App\Models\Employee;
use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Http;

    
class EmployeeController extends Controller
{
private function getUserFromToken($request)
{
    $token = $request->header('Authorization');

    $response = Http::withHeaders([
        'Authorization' => $token
    ])->get('http://127.0.0.1:8005/api/user');

    if (!$response->ok()) {
        return null;
    }

    return $response->json();
} 


public function store(Request $request)
{
    $user = $this->getUserFromToken($request);

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    if ($user['role'] !== 'admin') {
        return response()->json(['error' => 'Forbidden'], 403);
    }

    $data = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:employees',
        'department_id' => 'required|integer',
        'position_id' => 'required|integer'
    ]);

    $dep = Http::get('http://127.0.0.1:8002/api/departments/'.$data['department_id']);
    if (!$dep->ok()) {
        return response()->json(['error' => 'Department not found'], 400);
    }

    $pos = Http::get('http://127.0.0.1:8003/api/positions/'.$data['position_id']);
    if (!$pos->ok()) {
        return response()->json(['error' => 'Position not found'], 400);
    }

    return Employee::create($data);
}

    public function show($id)
    {
        return response()->json(Employee::findOrFail($id));
    }

    public function update(Request $request, $id)
{
    $user = $this->getUserFromToken($request);

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    if ($user['role'] !== 'admin') {
        return response()->json(['error' => 'Forbidden'], 403);
    }

    $employee = Employee::findOrFail($id);
    $employee->update($request->all());

    return $employee;
}

    public function destroy(Request $request, $id)
{
    $user = $this->getUserFromToken($request);

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    if ($user['role'] !== 'admin') {
        return response()->json(['error' => 'Forbidden'], 403);
    }

    Employee::destroy($id);

    return response()->json(['message' => 'Deleted']);
}
}