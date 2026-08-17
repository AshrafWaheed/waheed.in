<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\ContentEngineController;
use App\Http\Controllers\Admin\BookingAdminController;
use App\Http\Controllers\Admin\BookingSettingsController;
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

        // Booking availability: weekly grid, date exceptions, call-type knobs.
        Route::prefix('booking')->group(function () {
            Route::get('availability', [BookingSettingsController::class, 'index']);
            Route::put('availability', [BookingSettingsController::class, 'updateAvailability']);
            Route::get('preview', [BookingSettingsController::class, 'preview']);
            Route::post('overrides', [BookingSettingsController::class, 'storeOverride']);
            Route::delete('overrides/{override}', [BookingSettingsController::class, 'destroyOverride']);
            Route::patch('types/{type}', [BookingSettingsController::class, 'updateType']);
            Route::patch('settings', [BookingSettingsController::class, 'updateSettings']);
        });

        // Booked calls.
        Route::get('bookings', [BookingAdminController::class, 'index']);
        Route::get('bookings/{booking}', [BookingAdminController::class, 'show']);
        Route::patch('bookings/{booking}', [BookingAdminController::class, 'update']);
        Route::post('bookings/{booking}/cancel', [BookingAdminController::class, 'cancel']);
        Route::post('bookings/{booking}/resync', [BookingAdminController::class, 'resync']);

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

        // ── Content engine (documents/CONTENT_ENGINE.md) ──────────────────
        Route::prefix('content')->group(function () {
            Route::get('status', [ContentEngineController::class, 'status']);
            Route::get('topics', [ContentEngineController::class, 'topics']);
            Route::post('topics', [ContentEngineController::class, 'storeTopic']);
            Route::post('topics/{topic}/generate', [ContentEngineController::class, 'generate']);
            Route::get('drafts/{post}', [ContentEngineController::class, 'show']);
            Route::post('drafts/{post}/revise', [ContentEngineController::class, 'revise']);
            Route::post('drafts/{post}/accept-agent-check', [ContentEngineController::class, 'acceptAgentCheck']);

            // Queued generation: every expensive endpoint returns a job handle.
            Route::get('jobs', [ContentEngineController::class, 'activeJobs']);
            Route::get('jobs/{job}', [ContentEngineController::class, 'job']);

            // Phase 2 — platform variants
            Route::get('platforms', [ContentEngineController::class, 'platforms']);
            Route::get('drafts/{post}/variants', [ContentEngineController::class, 'variants']);
            Route::post('drafts/{post}/variants', [ContentEngineController::class, 'generateVariant']);
            Route::patch('variants/{variant}', [ContentEngineController::class, 'updateVariant']);
            Route::post('variants/{variant}/approve', [ContentEngineController::class, 'approveVariant']);
            Route::delete('variants/{variant}/approve', [ContentEngineController::class, 'unapproveVariant']);
            Route::delete('variants/{variant}', [ContentEngineController::class, 'destroyVariant']);

            // Phase 3 — indexation gate + syndication
            Route::get('drafts/{post}/indexation', [ContentEngineController::class, 'indexationStatus']);
            Route::post('drafts/{post}/indexation/check', [ContentEngineController::class, 'checkIndexation']);
            Route::post('drafts/{post}/indexation/confirm', [ContentEngineController::class, 'confirmIndexation']);
            Route::post('variants/{variant}/publish', [ContentEngineController::class, 'publishVariant']);
            Route::post('variants/{variant}/external-url', [ContentEngineController::class, 'recordVariantUrl']);
            Route::post('claims/{claim}/verify', [ContentEngineController::class, 'verifyClaim']);
            Route::delete('claims/{claim}/verify', [ContentEngineController::class, 'unverifyClaim']);
        });
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
