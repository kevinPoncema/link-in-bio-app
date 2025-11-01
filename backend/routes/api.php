<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\LinkController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('profiles/{profile}', [ProfileController::class, 'show']);
Route::get('profiles/{profile}/links', [LinkController::class, 'index']);
Route::get('links/{link}', [LinkController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('profiles', [ProfileController::class, 'store']);
    
    Route::get('my-profile', [ProfileController::class, 'index']); 
    Route::put('profiles', [ProfileController::class, 'update']);
    Route::delete('profiles', [ProfileController::class, 'destroy']);

    Route::post('links', [LinkController::class, 'store']);
    Route::put('links/{link}', [LinkController::class, 'update']);
    Route::delete('links/{link}', [LinkController::class, 'destroy']);
});