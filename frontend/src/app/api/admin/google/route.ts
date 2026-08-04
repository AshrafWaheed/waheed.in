import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: read the Google connection's state, or disconnect it (which also
// revokes the token at Google's end). Auth comes from the admin cookie.
//
// The OAuth *callback* is not here — it lives at /api/google/auth/callback,
// because that is the URI registered in the Google Console and it is hit by a
// browser redirect rather than by this panel.

export async function GET(): Promise<Response> {
  const res = await adminApi('/admin/google/status');
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(): Promise<Response> {
  const res = await adminApi('/admin/google', { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
