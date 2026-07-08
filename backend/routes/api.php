<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TaxonomyController;
use App\Http\Controllers\PublicPostController;
use Illuminate\Support\Facades\Route;

// ── Admin portal API (BFF: called by the Next.js server, Bearer-token auth) ──
Route::prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        Route::get('taxonomy', [TaxonomyController::class, 'index']);

        // Posts CRUD: GET/POST /posts, GET/PUT/PATCH/DELETE /posts/{post}
        Route::apiResource('posts', PostController::class);
    });
});

// ── Public blog API (read-only; consumed by Next.js SSR over loopback) ──
Route::get('posts', [PublicPostController::class, 'index']);
Route::get('posts/{post:slug}', [PublicPostController::class, 'show']);
