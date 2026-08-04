<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\GoogleAuthController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SubscriberController as AdminSubscriberController;
use App\Http\Controllers\Admin\TaxonomyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PublicPostController;
use App\Http\Controllers\SettingsController;
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

        // Google Calendar connection for the booking module. `callback` is
        // reached by the Next.js route handler at /api/google/auth/callback,
        // which is where the Google Console's registered redirect URI lands.
        Route::prefix('google')->group(function () {
            Route::get('status', [GoogleAuthController::class, 'status']);
            Route::get('connect', [GoogleAuthController::class, 'connect']);
            Route::post('callback', [GoogleAuthController::class, 'callback']);
            Route::post('test', [GoogleAuthController::class, 'test']);
            Route::delete('/', [GoogleAuthController::class, 'destroy']);
        });

        // User management.
        Route::post('users/{user}/password', [UserController::class, 'resetPassword']);
        Route::apiResource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('contacts', [AdminContactController::class, 'index']);
        Route::get('contacts/{contact}', [AdminContactController::class, 'show']);
        Route::get('subscribers', [AdminSubscriberController::class, 'index']);

        // Site mode (coming-soon / maintenance toggles).
        Route::get('settings', [SettingsController::class, 'show']);
        Route::patch('settings', [SettingsController::class, 'update']);

        // Posts CRUD: GET/POST /posts, GET/PUT/PATCH/DELETE /posts/{post}
        Route::apiResource('posts', PostController::class);
    });
});

// ── Public site mode (read by the Next.js proxy on every request) ──
Route::get('site/mode', [SettingsController::class, 'mode'])->middleware('throttle:120,1');

// ── Public blog API (read-only; consumed by Next.js SSR over loopback) ──
Route::get('posts', [PublicPostController::class, 'index']);
Route::get('posts/{post:slug}', [PublicPostController::class, 'show']);

// ── Public booking API (called by the Next.js /api/booking proxies) ──
// Read routes are loose, writes are tight: `store` is the one that puts a real
// event on a real calendar, so it is the one worth rate-limiting hard.
Route::prefix('booking')->group(function () {
    Route::get('types', [BookingController::class, 'types'])->middleware('throttle:60,1');
    Route::get('slots', [BookingController::class, 'slots'])->middleware('throttle:120,1');
    Route::post('/', [BookingController::class, 'store'])->middleware('throttle:8,60');

    Route::prefix('manage/{token}')->middleware('throttle:30,1')->group(function () {
        Route::get('/', [BookingController::class, 'show']);
        Route::post('cancel', [BookingController::class, 'cancel']);
        Route::post('reschedule', [BookingController::class, 'reschedule']);
    });
});

// ── Public form intake (called by the Next.js /api proxies) ──
Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:15,1');
Route::post('newsletter', [NewsletterController::class, 'store'])->middleware('throttle:15,1');
