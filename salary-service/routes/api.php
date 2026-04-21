<?php

use App\Http\Controllers\SalaryController;
use Illuminate\Support\Facades\Route;

Route::apiResource('salaries', SalaryController::class)
    ->middleware(['auth.api', 'role:admin']);
