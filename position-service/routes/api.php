<?php

use App\Http\Controllers\PositionController;
use Illuminate\Support\Facades\Route;

Route::apiResource('positions', PositionController::class)
    ->only(['index', 'show'])
    ->middleware('auth.api');

Route::apiResource('positions', PositionController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth.api', 'role:admin']);
