<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\PostController;
use Illuminate\Support\Facades\Route;

// ── Admin portal API (BFF: called by the Next.js server, Bearer-token auth) ──
Route::prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        // Posts CRUD: GET/POST /posts, GET/PUT/PATCH/DELETE /posts/{post}
        Route::apiResource('posts', PostController::class);
    });
});
