<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::apiResource('employees', EmployeeController::class)
    ->only(['index', 'show'])
    ->middleware('auth.api');

Route::apiResource('employees', EmployeeController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth.api', 'role:admin']);
