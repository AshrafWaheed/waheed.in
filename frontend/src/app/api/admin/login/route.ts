import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { laravelFetch } from '@/lib/laravel';
import { signSession, adminCookieOptions, ADMIN_COOKIE, ADMIN_COOKIE_MAXAGE } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LoginBody = { email?: string; password?: string };

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim();
  const password = body.password ?? '';
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 422 });
  }

  // Forward to Laravel (server-to-server) to validate + mint a Sanctum token.
  const res = await laravelFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message ?? 'These credentials do not match our records.' },
      { status: res.status },
    );
  }

  // Success → mint the signed admin session cookie carrying the bearer token.
  const value = await signSession({
    uid: data.user.id,
    name: data.user.name ?? '',
    email: data.user.email,
    role: data.user.role,
    token: data.token,
  });

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, value, adminCookieOptions(ADMIN_COOKIE_MAXAGE));

  return NextResponse.json({ user: data.user });
}
