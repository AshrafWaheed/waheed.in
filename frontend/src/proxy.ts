import { NextResponse, type NextRequest } from 'next/server';
import { COMING_SOON } from '@/lib/site-config';

// Next.js 16 renamed the `middleware` convention to `proxy` (see
// node_modules/next/dist/docs/.../proxy.md). Runs on the Node.js runtime.
//
// While COMING_SOON is on, every matched page request is rewritten to
// /coming-soon — EXCEPT the coming-soon screen itself and the /jundullah admin
// portal, which must stay reachable so an admin can log in. (Session B4 adds the
// proxy-level auth guard for /jundullah/* and the "admin previews the whole real
// site" bypass via the signed session cookie.)
export function proxy(req: NextRequest) {
  if (!COMING_SOON) return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === '/coming-soon' || pathname.startsWith('/jundullah')) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except API, Next internals, and any file with an extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.).*)'],
};
