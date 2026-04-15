<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PositionController extends Controller
{
    public function index()
    {
        return Position::all();
    }

    public function store(Request $request)
    {
         $data = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:employees',
        'department_id' => 'required|integer',
        'position_id' => 'required|integer'
    ]);

    // check department
    $dep = Http::get('http://127.0.0.1:8002/api/departments/'.$data['department_id']);

    if ($dep->failed()) {
        return response()->json(['error' => 'Department not found'], 400);
    }

    // 🔥 check position
    $pos = Http::get('http://127.0.0.1:8003/api/positions/'.$data['position_id']);

    if ($pos->failed()) {
        return response()->json(['error' => 'Position not found'], 400);
    }

    return Employee::create($data);
}

    public function show($id)
    {
        return Position::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $pos = Position::findOrFail($id);
        $pos->update($request->all());
        return $pos;
    }

    public function destroy($id)
    {
        Position::destroy($id);
        return ['message' => 'deleted'];
    }
}