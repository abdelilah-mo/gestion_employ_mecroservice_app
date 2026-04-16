<?php

use App\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;

Route::apiResource('departments', DepartmentController::class)
    ->only(['index', 'show'])
    ->middleware('auth.api');

Route::apiResource('departments', DepartmentController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth.api', 'role:admin']);
