import { NextResponse, type NextRequest } from 'next/server';
import { getSiteMode } from '@/lib/site-config';
import { ADMIN_COOKIE, verifySession } from '@/lib/session';

// Next.js 16 proxy (formerly `middleware`). Runs on the Node.js runtime.
//
// Single source of truth for two things:
//  1. Site-mode gate — while maintenance or coming-soon is on, the public is
//     rewritten to the matching screen, but a signed-in admin previews the
//     ENTIRE real site. Maintenance takes precedence over coming-soon.
//  2. Guard on the /jundullah admin portal.
//
// It also stamps internal request headers that the root layout reads to decide
// whether to render the site chrome (Nav/Footer) and the admin preview banner.
// Client-supplied copies of those headers are stripped first (anti-spoof).
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const headers = new Headers(req.headers);
  headers.delete('x-waheed-chrome');
  headers.delete('x-waheed-preview');
  const pass = () => NextResponse.next({ request: { headers } });

  const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
  const isAdmin = session?.role === 'admin';

  // ── Admin portal ─────────────────────────────────────────────────────────
  if (pathname === '/jundullah' || pathname.startsWith('/jundullah/')) {
    // The login page is always reachable; it redirects authed users onward.
    if (pathname === '/jundullah') return pass();
    // Everything deeper requires an admin session.
    if (!isAdmin) return NextResponse.redirect(new URL('/jundullah', req.url));
    return pass();
  }

  const withChrome = (preview: '' | 'coming-soon' | 'maintenance') => {
    headers.set('x-waheed-chrome', '1');
    if (preview) headers.set('x-waheed-preview', preview);
    return NextResponse.next({ request: { headers } });
  };

  const { comingSoon, maintenance } = await getSiteMode();
  // Which gate is active for the public. Maintenance wins over coming-soon.
  const gate: '' | 'coming-soon' | 'maintenance' =
    maintenance ? 'maintenance' : comingSoon ? 'coming-soon' : '';

  // ── Live site (no gate) ──────────────────────────────────────────────────
  if (!gate) return withChrome('');

  // ── A gate is on ─────────────────────────────────────────────────────────
  const screen = gate === 'maintenance' ? '/maintenance' : '/coming-soon';

  // Admins see the whole real site, with a preview banner naming the mode.
  if (isAdmin) {
    if (pathname === screen) return pass();
    return withChrome(gate);
  }

  // Everyone else → the active gate screen.
  if (pathname === screen) return pass();
  return NextResponse.rewrite(new URL(screen, req.url), { request: { headers } });
}

export const config = {
  // Run on everything except API, Next internals, and any file with an extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.).*)'],
};
