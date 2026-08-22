import { mintUmamiToken } from '@/lib/umami';
import StatsBridge from './StatsBridge';

/**
 * The doorway from the panel into Umami.
 *
 * Access control is the panel layout's, not this file's: everything under
 * (panel) already redirects an unauthenticated visitor and re-checks that the
 * Laravel token behind the admin cookie is still live. So by the time this
 * renders, the caller is a confirmed admin — which is the whole basis on which
 * it is willing to mint an Umami session.
 *
 * A fresh token every visit, deliberately. Caching one would mean storing an
 * Umami credential somewhere new for no gain: minting is a single loopback
 * request against a database this box already runs.
 */
export const dynamic = 'force-dynamic';

export default async function StatsBridgePage() {
  let token: string | null = null;
  let error: string | null = null;

  try {
    token = await mintUmamiToken();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not reach the analytics app.';
  }

  if (error || !token) {
    return (
      <div className="adm-bridge">
        <h1 className="adm-h1">Analytics is not reachable</h1>
        <p>{error}</p>
        <p>
          The dashboard itself may still be fine — try{' '}
          <a href="/stats" target="_blank" rel="noopener noreferrer">opening it directly</a> and
          signing in. If that also fails, check <code>pm2 status waheed-umami</code>.
        </p>
      </div>
    );
  }

  return <StatsBridge token={token} to="/stats" />;
}
