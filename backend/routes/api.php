<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\LinkController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('/profiles', ProfileController::class)->only(['show']);
Route::apiResource('/profiles.links', LinkController::class)->only(['index', 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas de perfiles (CRUD)
    Route::apiResource('profiles', ProfileController::class)->only(['index', 'store', 'update', 'destroy']);
    //rutas de links (CRUD)
    Route::apiResource('links', LinkController::class)->only(['store', 'update', 'destroy']);
});


