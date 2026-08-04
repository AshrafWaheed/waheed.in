<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * The OAuth half of the booking module's Google integration: build the consent
 * URL, trade the code for tokens, keep the access token fresh, and revoke on
 * disconnect. {@see GoogleCalendarService} does the actual calendar work and
 * asks this class for a valid token.
 *
 * Hand-rolled on Laravel's HTTP client rather than pulling in google/apiclient —
 * this is five endpoints, and it matches how HubSpotService and BeehiivService
 * already talk to third parties in this codebase.
 *
 * ── The one operational fact worth knowing ──────────────────────────────────
 * A refresh token issued to an app whose OAuth consent screen is EXTERNAL and
 * still in TESTING expires after 7 DAYS. That is a token-lifetime rule, not a
 * traffic limit — a quiet site does not escape it. The consent screen must be
 * published (or set to Internal on Workspace), or this integration breaks
 * weekly with invalid_grant. {@see needsReconnect()} is what surfaces that in
 * the admin console instead of letting it fail silently at 3am.
 */
class GoogleOAuthService
{
    private const AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';

    private const TOKEN = 'https://oauth2.googleapis.com/token';

    private const REVOKE = 'https://oauth2.googleapis.com/revoke';

    private const USERINFO = 'https://openidconnect.googleapis.com/v1/userinfo';

    /**
     * calendar.events mints the event and its Meet link; calendar.readonly
     * powers freeBusy so real commitments block slots. The openid trio is only
     * so the admin console can name the connected account.
     */
    public const SCOPES = [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
    ];

    public function isConfigured(): bool
    {
        return (bool) config('services.google.client_id')
            && (bool) config('services.google.client_secret');
    }

    /**
     * Where to send the admin to grant consent.
     *
     * `access_type=offline` + `prompt=consent` is deliberate and belt-and-braces:
     * Google only returns a refresh token on the FIRST consent for a given
     * client/user pair, so without the forced prompt a reconnect after a
     * revocation would hand back an access token and no refresh token, and the
     * integration would die an hour later with no obvious cause.
     */
    public function authorizeUrl(string $state): string
    {
        return self::AUTH.'?'.http_build_query([
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect'),
            'response_type' => 'code',
            'scope' => implode(' ', self::SCOPES),
            'access_type' => 'offline',
            'prompt' => 'consent',
            'include_granted_scopes' => 'true',
            'state' => $state,
        ]);
    }

    /**
     * Trade the ?code= from the callback for tokens and persist the account.
     *
     * @throws RuntimeException with a message fit to show an admin
     */
    public function connect(string $code): GoogleAccount
    {
        $res = Http::asForm()->timeout(15)->post(self::TOKEN, [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect'),
            'grant_type' => 'authorization_code',
        ]);

        if (! $res->successful()) {
            Log::error('Google token exchange failed', ['body' => $res->json()]);
            throw new RuntimeException($this->explain($res->json('error'), $res->json('error_description')));
        }

        $tok = $res->json();

        if (empty($tok['refresh_token'])) {
            // Almost always a re-consent where Google withheld the refresh token.
            // Revoking the app's access at myaccount.google.com/permissions and
            // reconnecting is the reliable cure.
            throw new RuntimeException(
                'Google returned no refresh token. Remove "WAHEED" from your Google account '
                .'permissions (myaccount.google.com/permissions) and connect again.'
            );
        }

        $profile = Http::withToken($tok['access_token'])->timeout(10)->get(self::USERINFO)->json();

        // One row, always: reconnecting replaces the existing account rather
        // than quietly stacking a second one behind it.
        $account = GoogleAccount::current() ?? new GoogleAccount;

        $account->fill([
            'email' => $profile['email'] ?? null,
            'access_token' => $tok['access_token'],
            'refresh_token' => $tok['refresh_token'],
            'expires_at' => now()->addSeconds((int) ($tok['expires_in'] ?? 3600)),
            'scopes' => $tok['scope'] ?? implode(' ', self::SCOPES),
            'calendar_id' => config('services.google.calendar_id', 'primary'),
            'connected_at' => now(),
        ])->save();

        return $account;
    }

    /**
     * A usable access token, refreshing first if it is stale.
     *
     * @throws RuntimeException when the refresh token itself has died — the
     *                          caller should surface "reconnect Google", not retry
     */
    public function accessToken(GoogleAccount $account): string
    {
        if (! $account->needsRefresh()) {
            return $account->access_token;
        }

        if (! $account->refresh_token) {
            throw new RuntimeException('Google is not connected. Connect it in Admin → Bookings → Google.');
        }

        $res = Http::asForm()->timeout(15)->post(self::TOKEN, [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $account->refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if (! $res->successful()) {
            $error = $res->json('error');

            // invalid_grant means the refresh token is dead for good: revoked,
            // password-changed, or expired under the 7-day testing rule. Clear
            // it so the admin console shows "disconnected" rather than retrying
            // a token that will never work again.
            if ($error === 'invalid_grant') {
                $account->forceFill(['access_token' => null, 'refresh_token' => null, 'expires_at' => null])->save();
            }

            Log::error('Google token refresh failed', ['error' => $error, 'body' => $res->json()]);
            throw new RuntimeException($this->explain($error, $res->json('error_description')));
        }

        $tok = $res->json();

        $account->forceFill([
            'access_token' => $tok['access_token'],
            'expires_at' => now()->addSeconds((int) ($tok['expires_in'] ?? 3600)),
            // Google usually omits refresh_token on refresh; keep the old one.
            'refresh_token' => $tok['refresh_token'] ?? $account->refresh_token,
        ])->save();

        return $account->access_token;
    }

    /** Revoke at Google, then forget locally. Best-effort on the remote half. */
    public function disconnect(GoogleAccount $account): void
    {
        if ($token = ($account->refresh_token ?: $account->access_token)) {
            try {
                Http::asForm()->timeout(10)->post(self::REVOKE, ['token' => $token]);
            } catch (\Throwable $e) {
                Log::warning('Google revoke failed (clearing locally anyway)', ['message' => $e->getMessage()]);
            }
        }

        $account->delete();
    }

    /** True when the admin must go and re-authorise. Drives the console badge. */
    public function needsReconnect(?GoogleAccount $account): bool
    {
        return ! $account || ! $account->isConnected();
    }

    /** Whether every scope we asked for was actually granted. */
    public function missingScopes(GoogleAccount $account): array
    {
        $granted = preg_split('/\s+/', (string) $account->scopes, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_diff(self::SCOPES, $granted));
    }

    /** Turn Google's terse error codes into something an admin can act on. */
    private function explain(?string $error, ?string $description): string
    {
        return match ($error) {
            'invalid_grant' => 'Google rejected the saved authorisation. This is what happens when the '
                .'OAuth consent screen is still in "Testing" (refresh tokens die after 7 days), or access '
                .'was revoked. Publish the consent screen, then connect again.',
            'invalid_client' => 'The Google client ID or secret is wrong. Check GOOGLE_CLIENT_ID / '
                .'GOOGLE_CLIENT_SECRET in backend/.env against the credentials in the Google Console.',
            'redirect_uri_mismatch' => 'The redirect URI does not match the one registered in the Google '
                .'Console. It must be exactly '.config('services.google.redirect').'.',
            'access_denied' => 'Consent was declined at the Google screen.',
            default => 'Google returned "'.($error ?? 'an unknown error').'"'
                .($description ? ': '.$description : '.'),
        };
    }
}
