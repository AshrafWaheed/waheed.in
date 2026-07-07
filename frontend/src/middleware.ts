import { NextResponse, type NextRequest } from 'next/server';
import { COMING_SOON } from '@/lib/site-config';

// While COMING_SOON is on, every page request is rewritten to /coming-soon.
// API routes and static assets are excluded (see matcher), so the newsletter
// form, images, favicons, etc. keep working. Nothing is deleted — flip the
// toggle in src/lib/site-config.ts to bring the real site back.
export function middleware(req: NextRequest) {
  if (!COMING_SOON) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === '/coming-soon') return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except API, Next internals, and any file with an extension
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.).*)'],
};
