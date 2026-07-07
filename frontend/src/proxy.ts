import { NextResponse, type NextRequest } from 'next/server';
import { COMING_SOON } from '@/lib/site-config';
import { ADMIN_COOKIE, verifySession } from '@/lib/session';

// Next.js 16 proxy (formerly `middleware`). Runs on the Node.js runtime.
//
// Single source of truth for two things:
//  1. Coming-soon gate — while COMING_SOON is on, the public is rewritten to
//     /coming-soon, but a signed-in admin previews the ENTIRE real site.
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

  const withChrome = (preview: boolean) => {
    headers.set('x-waheed-chrome', '1');
    if (preview) headers.set('x-waheed-preview', '1');
    return NextResponse.next({ request: { headers } });
  };

  // ── Live site (coming-soon off) ──────────────────────────────────────────
  if (!COMING_SOON) return withChrome(false);

  // ── Coming-soon on ───────────────────────────────────────────────────────
  // Admins see the whole real site, with a preview banner.
  if (isAdmin) {
    if (pathname === '/coming-soon') return pass();
    return withChrome(true);
  }

  // Everyone else → the coming-soon screen.
  if (pathname === '/coming-soon') return pass();
  return NextResponse.rewrite(new URL('/coming-soon', req.url), { request: { headers } });
}

export const config = {
  // Run on everything except API, Next internals, and any file with an extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.).*)'],
};
