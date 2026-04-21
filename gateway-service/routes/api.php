<?php

use App\Http\Controllers\GatewayController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.api')->controller(GatewayController::class)->group(function (): void {
    Route::get('/employees', 'employees');
    Route::get('/employees/{path}', 'employees')->where('path', '.*');

    Route::get('/departments', 'departments');
    Route::get('/departments/{path}', 'departments')->where('path', '.*');

    Route::get('/positions', 'positions');
    Route::get('/positions/{path}', 'positions')->where('path', '.*');
});

Route::middleware(['auth.api', 'role:admin'])->controller(GatewayController::class)->group(function (): void {
    Route::post('/employees', 'employees');
    Route::match(['put', 'patch'], '/employees/{path}', 'employees')->where('path', '.*');
    Route::delete('/employees/{path}', 'employees')->where('path', '.*');

    Route::post('/departments', 'departments');
    Route::match(['put', 'patch'], '/departments/{path}', 'departments')->where('path', '.*');
    Route::delete('/departments/{path}', 'departments')->where('path', '.*');

    Route::post('/positions', 'positions');
    Route::match(['put', 'patch'], '/positions/{path}', 'positions')->where('path', '.*');
    Route::delete('/positions/{path}', 'positions')->where('path', '.*');

    Route::any('/salaries', 'salaries');
    Route::any('/salaries/{path}', 'salaries')->where('path', '.*');
});
