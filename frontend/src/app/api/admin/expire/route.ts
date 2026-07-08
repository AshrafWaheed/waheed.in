import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET target used when the panel detects a validly-signed cookie whose Sanctum
// token is no longer accepted by Laravel (e.g. revoked by a password change or
// token cleanup). Clearing the stale cookie here prevents a redirect loop back
// into the panel, then sends the admin to the login screen to sign in fresh.
export async function GET(request: Request) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, '', adminCookieOptions(0));
  return NextResponse.redirect(new URL('/jundullah?expired=1', request.url));
}
