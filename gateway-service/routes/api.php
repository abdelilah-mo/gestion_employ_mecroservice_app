<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;


// 👤 Employees
Route::get('/employees', function (Request $request) {

    $response = Http::withHeaders([
        'Authorization' => $request->header('Authorization'),
        'Accept' => 'application/json'
    ])->get('http://127.0.0.1:8002/api/employees');
    return response()->json($response->json());
});

// ➕ Add Employee
Route::post('/employees', function (Request $request) {
    return Http::withHeaders([
        'Authorization' => $request->header('Authorization')
    ])->post('http://127.0.0.1:8002/api/employees', $request->all())->json();
});

Route::get('/departments', function (Request $request) {
    return Http::withHeaders([
        'Authorization' => $request->header('Authorization'),
        'Accept' => 'application/json'
    ])->get(config('services.department_service.url').'/api/departments');
});


// positions
Route::get('/positions', function (Request $request) {
    return Http::withHeaders([
        'Authorization' => $request->header('Authorization'),
    ])->get(config('services.position_service.url').'/api/positions')->json();
});