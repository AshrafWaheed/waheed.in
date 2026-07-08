import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET target used when the panel detects a validly-signed cookie whose Sanctum
// token is no longer accepted by Laravel (e.g. revoked by a password change or
// token cleanup). Clearing the stale cookie here prevents a redirect loop back
// into the panel, then sends the admin to the login screen to sign in fresh.
//
// The Location is RELATIVE on purpose: behind nginx, request.url is the internal
// http://localhost:3000 origin, so building an absolute URL from it would leak
// that host to the browser. A relative Location is resolved by the browser
// against the real domain.
export async function GET() {
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: '/jundullah?expired=1' },
  });
  res.cookies.set(ADMIN_COOKIE, '', adminCookieOptions(0));
  return res;
}
