'use client';

import { useEffect, useState } from 'react';

/**
 * Umami's own storage key (src/lib/constants.ts in that app: AUTH_TOKEN).
 * Duplicated here rather than imported from @/lib/umami, which is marked
 * `server-only` — pulling it in from a client component is a build error, and
 * rightly so: that module holds the admin password.
 */
const UMAMI_AUTH_KEY = 'umami.auth';

/**
 * Writes the minted token where Umami looks for it, then hands over.
 *
 * `JSON.stringify` is not decoration — Umami's own storage helper stores the
 * token that way (`setItem` does JSON.stringify, `getItem` does JSON.parse), so
 * writing the bare string would read back as null and bounce you to the login
 * screen. Verified against a real login before this was written.
 *
 * `replace` rather than `assign` so the browser Back button returns to the
 * panel rather than to this page, which would mint a second token.
 */
export default function StatsBridge({ token, to }: { token: string; to: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(UMAMI_AUTH_KEY, JSON.stringify(token));
    } catch {
      // Private mode, or storage blocked. Umami cannot work at all without it,
      // so say so rather than redirecting into a login loop.
      setFailed(true);
      return;
    }
    window.location.replace(to);
  }, [token, to]);

  return (
    <div className="adm-bridge">
      {failed ? (
        <>
          <h1 className="adm-h1">Your browser is blocking storage</h1>
          <p>
            Umami keeps its session in local storage, and this browser will not allow it, so we
            cannot sign you in automatically. You can still{' '}
            <a href={to}>open analytics and log in there</a>.
          </p>
        </>
      ) : (
        <p className="adm-bridge-wait">Signing you in to analytics…</p>
      )}
    </div>
  );
}
