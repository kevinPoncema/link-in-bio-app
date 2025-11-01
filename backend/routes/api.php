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
Route::apiResource('/links', LinkController::class)->only(['show']);
Route::get('/profiles/{profile}/links', [LinkController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas de perfiles (CRUD)
    Route::apiResource('profiles', ProfileController::class)->only(['index', 'store', 'update', 'destroy']);
    //rutas de links (CRUD)
    Route::apiResource('links', LinkController::class)->only(['store', 'update', 'destroy']);
});


