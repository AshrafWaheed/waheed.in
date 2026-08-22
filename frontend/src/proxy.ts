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
// whether to render the site chrome (Nav/Footer), the admin preview banner, and
// whether the route is one where analytics may run at all.
// Client-supplied copies of those headers are stripped first (anti-spoof).
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const headers = new Headers(req.headers);
  headers.delete('x-waheed-chrome');
  headers.delete('x-waheed-preview');
  headers.delete('x-waheed-track');
  const pass = () => NextResponse.next({ request: { headers } });

  /*
   * A PUBLIC route: one where a visitor might be measured, and therefore one
   * that must carry the cookie banner. Everything reachable by the public is
   * public — the live site, and the coming-soon/maintenance screens, which are
   * exactly the pages a pre-launch audience is counted on.
   *
   * The admin portal is the exception, and it is stamped by omission. Nothing
   * measures /jundullah, which matters more than it sounds: Clarity replays a
   * session as a video of the page, and those pages hold client names, emails,
   * phone numbers and unpublished drafts. Recording the back office would have
   * been a quiet export of contact data to a third party.
   */
  const publicPass = () => {
    headers.set('x-waheed-track', '1');
    return NextResponse.next({ request: { headers } });
  };

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
    headers.set('x-waheed-track', '1');
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

  /*
   * The legal pages stay reachable even behind the gate, chrome-less and on
   * their own. Two reasons, both about the gate screen rather than the pages:
   * the coming-soon screen collects email addresses, and Art 13 says a privacy
   * notice has to be available at the point of collection, not after launch.
   * And the cookie banner runs on that screen too, so "what each one does" and
   * the withdrawal panel have to lead somewhere that is not the gate itself.
   */
  if (pathname === '/privacy' || pathname === '/terms' || pathname === '/cookies') {
    return publicPass();
  }

  // Admins see the whole real site, with a preview banner naming the mode.
  if (isAdmin) {
    if (pathname === screen) return publicPass();
    return withChrome(gate);
  }

  // Everyone else → the active gate screen.
  if (pathname === screen) return publicPass();
  headers.set('x-waheed-track', '1');
  return NextResponse.rewrite(new URL(screen, req.url), { request: { headers } });
}

export const config = {
  // Run on everything except API, Next internals, and any file with an extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.).*)'],
};
