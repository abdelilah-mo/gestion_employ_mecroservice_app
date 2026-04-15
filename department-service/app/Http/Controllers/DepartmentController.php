<?php

namespace App\Http\Controllers;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required'
        ]);

        return Department::create($data);
    }

    public function show($id)
    {
        return Department::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $dep = Department::findOrFail($id);
        $dep->update($request->all());
        return $dep;
    }

    public function destroy($id)
    {
        Department::destroy($id);
        return ['message' => 'deleted'];
    }
}