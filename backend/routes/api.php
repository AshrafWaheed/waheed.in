<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SubscriberController as AdminSubscriberController;
use App\Http\Controllers\Admin\TaxonomyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PublicPostController;
use Illuminate\Support\Facades\Route;

// ── Admin portal API (BFF: called by the Next.js server, Bearer-token auth) ──
Route::prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        // Current admin's own account.
        Route::patch('profile', [AuthController::class, 'updateProfile']);
        Route::post('profile/password', [AuthController::class, 'updatePassword']);

        Route::get('taxonomy', [TaxonomyController::class, 'index']);

        // User management.
        Route::post('users/{user}/password', [UserController::class, 'resetPassword']);
        Route::apiResource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('contacts', [AdminContactController::class, 'index']);
        Route::get('contacts/{contact}', [AdminContactController::class, 'show']);
        Route::get('subscribers', [AdminSubscriberController::class, 'index']);

        // Posts CRUD: GET/POST /posts, GET/PUT/PATCH/DELETE /posts/{post}
        Route::apiResource('posts', PostController::class);
    });
});

// ── Public blog API (read-only; consumed by Next.js SSR over loopback) ──
Route::get('posts', [PublicPostController::class, 'index']);
Route::get('posts/{post:slug}', [PublicPostController::class, 'show']);

// ── Public form intake (called by the Next.js /api proxies) ──
Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:15,1');
Route::post('newsletter', [NewsletterController::class, 'store'])->middleware('throttle:15,1');
