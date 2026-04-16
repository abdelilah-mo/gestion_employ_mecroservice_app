<?php

use App\Http\Controllers\SalaryController;
use Illuminate\Support\Facades\Route;

Route::apiResource('salaries', SalaryController::class)
    ->only(['index', 'show'])
    ->middleware('auth.api');

Route::apiResource('salaries', SalaryController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth.api', 'role:admin']);
