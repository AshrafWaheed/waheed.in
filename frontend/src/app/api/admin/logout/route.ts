import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { laravelFetch } from '@/lib/laravel';
import { getSession } from '@/lib/session-server';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getSession();

  // Best-effort revoke of the Laravel token; clear the cookie regardless.
  if (session?.token) {
    await laravelFetch('/admin/logout', { method: 'POST', token: session.token }).catch(() => {});
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, '', adminCookieOptions(0));

  return NextResponse.json({ ok: true });
}
