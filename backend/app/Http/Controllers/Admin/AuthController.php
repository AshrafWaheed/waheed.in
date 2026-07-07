<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** How long an issued admin token stays valid. */
    private const TOKEN_TTL_DAYS = 7;

    /** Login attempts allowed per email before a short lockout. */
    private const MAX_ATTEMPTS = 5;

    /**
     * Validate admin credentials and issue a Sanctum bearer token.
     *
     * This is the Laravel side of the BFF flow: it is called server-to-server
     * by the Next.js `/api/admin/login` route handler, never directly by the
     * browser. Rate-limiting is keyed on the email (the client IP seen here is
     * always the Next.js server).
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = 'admin-login:'.Str::lower($data['email']);

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many attempts. Try again in {$seconds} seconds."],
            ])->status(429);
        }

        $user = User::where('email', $data['email'])->first();

        // Same generic failure whether the email is unknown, the password is
        // wrong, or the account is not an admin — no account enumeration.
        if (! $user || ! Hash::check($data['password'], $user->password) || ! $user->isAdmin()) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        RateLimiter::clear($throttleKey);

        $user->forceFill(['last_login_at' => now()])->save();

        $token = $user->createToken(
            name: 'admin-portal',
            expiresAt: now()->addDays(self::TOKEN_TTL_DAYS),
        )->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in_days' => self::TOKEN_TTL_DAYS,
            'user' => $this->userPayload($user),
        ]);
    }

    /** Return the currently authenticated admin. */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    /** Revoke the token used to make this request. */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
}
