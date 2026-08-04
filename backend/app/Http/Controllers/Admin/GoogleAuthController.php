<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GoogleAccount;
use App\Services\GoogleCalendarService;
use App\Services\GoogleOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Connect / inspect / disconnect the single Google account the booking module
 * writes to. Every route here is admin-only.
 *
 * ── How the redirect actually gets back here ────────────────────────────────
 * The URI registered in the Google Console is
 * https://waheed.in/api/google/auth/callback, and nginx routes /api to
 * NEXT.JS. So Google redirects the admin's browser to Next; Next — which holds
 * the admin session cookie — posts the code to {@see callback()} over loopback
 * with the admin's bearer token. The code therefore never reaches Laravel
 * unauthenticated, which is why this controller can sit entirely behind
 * auth:sanctum + admin.
 */
class GoogleAuthController extends Controller
{
    private const STATE_TTL = 600; // 10 minutes to complete the consent screen

    /** What the admin console's Google panel renders. */
    public function status(GoogleOAuthService $oauth): JsonResponse
    {
        $account = GoogleAccount::current();

        if (! $oauth->isConfigured()) {
            return response()->json([
                'configured' => false,
                'connected' => false,
                'message' => 'GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set in backend/.env.',
            ]);
        }

        if (! $account || ! $account->isConnected()) {
            return response()->json([
                'configured' => true,
                'connected' => false,
                'message' => 'No Google account is connected yet.',
            ]);
        }

        $missing = $oauth->missingScopes($account);

        return response()->json([
            'configured' => true,
            'connected' => true,
            'email' => $account->email,
            'calendar_id' => $account->calendar_id,
            'connected_at' => $account->connected_at,
            'token_expires_at' => $account->expires_at,
            'missing_scopes' => $missing,
            // A partial grant is worse than none: the account looks connected
            // but events or freebusy will 403 later, far from the cause.
            'message' => $missing
                ? 'Connected, but these scopes were not granted: '.implode(', ', $missing).'. Reconnect and accept all of them.'
                : 'Connected and fully scoped.',
        ]);
    }

    /**
     * Hand back the Google consent URL. The `state` is minted here and parked
     * in the cache so the callback can prove the round trip started with us and
     * not with someone who found the redirect URI.
     */
    public function connect(Request $request, GoogleOAuthService $oauth): JsonResponse
    {
        if (! $oauth->isConfigured()) {
            return response()->json([
                'error' => 'Google credentials are not configured on the server.',
            ], 422);
        }

        $state = Str::random(40);
        Cache::put('google_oauth_state:'.$state, $request->user()->id, self::STATE_TTL);

        return response()->json(['url' => $oauth->authorizeUrl($state)]);
    }

    /** Called by the Next.js callback route with the code Google handed it. */
    public function callback(Request $request, GoogleOAuthService $oauth): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'state' => ['required', 'string'],
        ]);

        $key = 'google_oauth_state:'.$data['state'];
        $userId = Cache::pull($key); // single use — pull, never get

        if (! $userId || $userId !== $request->user()->id) {
            return response()->json([
                'error' => 'That sign-in link has expired or was started by someone else. Try connecting again.',
            ], 422);
        }

        try {
            $account = $oauth->connect($data['code']);
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $missing = $oauth->missingScopes($account);

        return response()->json([
            'ok' => true,
            'email' => $account->email,
            'missing_scopes' => $missing,
        ]);
    }

    /** Revoke at Google and forget the account here. */
    public function destroy(GoogleOAuthService $oauth): JsonResponse
    {
        if ($account = GoogleAccount::current()) {
            $oauth->disconnect($account);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Prove the whole chain works — token refresh, event insert, Meet minting,
     * delete — without waiting for a real booking to expose a broken link.
     */
    public function test(GoogleCalendarService $calendar): JsonResponse
    {
        $result = $calendar->selfTest();

        return response()->json($result, $result['ok'] ? 200 : 422);
    }
}
