import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminApi } from '@/lib/admin-api';
import { getSession } from '@/lib/session-server';
import { signSession, adminCookieOptions, ADMIN_COOKIE } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Update the current admin's own name / email, then re-sign the session cookie
// so the sidebar + preview banner reflect the new values immediately.
export async function PATCH(req: Request) {
  const body = await req.text();
  const res = await adminApi('/admin/profile', { method: 'PATCH', body });
  const data = await res.json().catch(() => ({}) as Record<string, unknown>);

  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const session = await getSession();
  const user = (data as { user?: { name: string; email: string } }).user;
  if (session && user) {
    const remaining = session.exp - Math.floor(Date.now() / 1000);
    if (remaining > 0) {
      const value = await signSession(
        { uid: session.uid, name: user.name, email: user.email, role: session.role, token: session.token },
        remaining,
      );
      const jar = await cookies();
      jar.set(ADMIN_COOKIE, value, adminCookieOptions(remaining));
    }
  }

  return NextResponse.json(data, { status: 200 });
}
