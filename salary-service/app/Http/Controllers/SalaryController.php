<?php

namespace App\Http\Controllers;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SalaryController extends Controller
{
    public function index()
{
    return Salary::all();
}
public function show($id)
{
    return Salary::findOrFail($id);
}
    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|integer',
            'bonus' => 'required|numeric'
        ]);

        // 🔥 get employee
        $emp = Http::get('http://127.0.0.1:8001/api/employees/'.$data['employee_id']);

        if (!$emp->ok()) {
            return response()->json(['error' => 'Employee not found'], 400);
        }

        $employee = $emp->json();

        // 🔥 get position
        $pos = Http::get('http://127.0.0.1:8003/api/positions/'.$employee['position_id']);

        if (!$pos->ok()) {
            return response()->json(['error' => 'Position not found'], 400);
        }

        $position = $pos->json();

        // 🔥 calculate salary
        $total = $position['base_salary'] + $data['bonus'];

        $salary = Salary::create([
            'employee_id' => $data['employee_id'],
            'bonus' => $data['bonus'],
            'total_salary' => $total
        ]);

        return response()->json($salary, 201);
    }

    public function update(Request $request, $id)
{
    $salary = Salary::findOrFail($id);

    $data = $request->validate([
        'bonus' => 'required|numeric'
    ]);

    // 🔥 رجع employee
    $emp = Http::get('http://127.0.0.1:8001/api/employees/'.$salary->employee_id);

    if (!$emp->ok()) {
        return response()->json(['error' => 'Employee not found'], 400);
    }

    $employee = $emp->json();

    // 🔥 رجع position
    $pos = Http::get('http://127.0.0.1:8003/api/positions/'.$employee['position_id']);

    if (!$pos->ok()) {
        return response()->json(['error' => 'Position not found'], 400);
    }

    $position = $pos->json();

    // 🔥 recalcul
    $total = $position['base_salary'] + $data['bonus'];

    $salary->update([
        'bonus' => $data['bonus'],
        'total_salary' => $total
    ]);

    return $salary;
}
public function destroy($id)
{
    Salary::destroy($id);
    return response()->json(['message' => 'deleted']);
}
}