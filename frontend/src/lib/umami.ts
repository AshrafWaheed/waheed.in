import 'server-only';

/**
 * Mints an Umami session for an admin who is already signed in to /jundullah.
 *
 * Umami is a separate application with its own user table, so there is no
 * shared session to hand over. What makes a bridge possible at all is that it
 * keeps its JWT in `localStorage` under `umami.auth` on the SAME origin as this
 * site — so a page here can write the key and Umami will pick it up.
 *
 * ── Why this is not as alarming as it sounds ────────────────────────────────
 *
 * The password never reaches the browser. This module runs server-side only
 * (`server-only` makes that a build error rather than a convention), calls
 * Umami over the loopback address so the credentials never touch the public
 * interface, and returns just the resulting token.
 *
 * The token IS handed to the browser, because that is the entire point. Two
 * things bound the damage if it leaks: Umami holds no personal data — there is
 * no IP column in its schema, only page counts — and the token is bound to a
 * hash of the admin password, so changing that password invalidates every token
 * ever issued.
 *
 * ── The tradeoff to know about ─────────────────────────────────────────────
 *
 * `localStorage` is per-origin, and Umami is mounted at waheed.in/stats rather
 * than on its own subdomain. So `umami.auth` shares a bucket with the public
 * site, and an XSS anywhere on waheed.in could read it. That was accepted
 * deliberately: moving Umami to stats.waheed.in would isolate the token, but a
 * different origin cannot have its localStorage written from here, which would
 * make this bridge impossible. Given the blast radius is page-view counts, the
 * trade went to convenience. If Umami ever holds anything sensitive, revisit
 * that decision before adding to it.
 */
export async function mintUmamiToken(): Promise<string> {
  const base = process.env.UMAMI_INTERNAL_URL;
  const username = process.env.UMAMI_ADMIN_USER;
  const password = process.env.UMAMI_ADMIN_PASSWORD;

  if (!base || !username || !password) {
    throw new Error('Umami bridge is not configured (UMAMI_INTERNAL_URL / _USER / _PASSWORD).');
  }

  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    // A stale token would silently drop the admin on a login screen, which is
    // the one outcome this whole file exists to prevent.
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Umami rejected the bridge login (HTTP ${res.status}).`);
  }

  const data = (await res.json()) as { token?: string; requiresTwoFactor?: boolean };

  // If someone turns on 2FA for the bridge account, Umami returns a partial
  // token instead and expects a second factor. Failing loudly here is right:
  // silently forwarding a partial token would land them on a half-finished
  // login with no explanation.
  if (data.requiresTwoFactor) {
    throw new Error(
      'The Umami account has two-factor enabled, so it cannot be bridged. ' +
      'Sign in at /stats directly, or use an account without 2FA for the bridge.',
    );
  }

  if (!data.token) {
    throw new Error('Umami returned no token.');
  }

  return data.token;
}
