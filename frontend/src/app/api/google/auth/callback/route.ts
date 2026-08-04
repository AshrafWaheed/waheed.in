import { redirect } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Where Google sends the admin's browser after the consent screen.
 *
 * This lives in Next rather than Laravel for one infrastructural reason: nginx
 * routes `/api/` to :3000, and Laravel on :8000 is loopback-only. The URI
 * registered in the Google Console — https://waheed.in/api/google/auth/callback
 * — therefore cannot reach Laravel directly, and pointing it at :8000 would
 * mean exposing the backend publicly. Instead the code lands here and is
 * forwarded over loopback with the admin's bearer token, which is the same BFF
 * shape every other /api/admin/* route uses.
 *
 * The upside of routing it this way: the code arrives already attached to a
 * logged-in admin session, so Laravel's callback can sit behind auth:sanctum
 * and never has to accept an unauthenticated ?code=.
 *
 * This is a browser navigation, not a fetch — so every outcome is a redirect
 * back to the admin panel carrying a message, never a JSON body.
 */
const PANEL = '/jundullah/bookings/google';

function back(params: Record<string, string>): never {
  redirect(`${PANEL}?${new URLSearchParams(params)}`);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // The admin declined at Google's screen, or Google refused outright.
  if (error) {
    back({
      google: 'error',
      message:
        error === 'access_denied'
          ? 'Consent was declined, so nothing was connected.'
          : `Google returned "${error}".`,
    });
  }

  if (!code || !state) {
    back({ google: 'error', message: 'Google did not return an authorisation code.' });
  }

  let res: Response;
  try {
    // adminApi attaches the bearer token from the signed admin cookie. If the
    // session died while the admin was on Google's screen this comes back 401,
    // which is reported as "log in and try again" rather than a bare failure.
    res = await adminApi('/admin/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });
  } catch {
    back({ google: 'error', message: 'Could not reach the server to finish connecting.' });
  }

  if (res.status === 401) {
    back({ google: 'error', message: 'Your admin session expired. Log in and connect again.' });
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    email?: string;
    missing_scopes?: string[];
  };

  if (!res.ok) {
    back({ google: 'error', message: data.error ?? 'Connecting to Google failed.' });
  }

  // Connected, but Google withheld something we asked for — the account will
  // look fine and then 403 on the first real booking, so say so now.
  if (data.missing_scopes?.length) {
    back({
      google: 'partial',
      message: `Connected as ${data.email ?? 'that account'}, but these scopes were not granted: ${data.missing_scopes.join(', ')}. Reconnect and accept all of them.`,
    });
  }

  back({ google: 'connected', message: `Connected as ${data.email ?? 'your Google account'}.` });
}
