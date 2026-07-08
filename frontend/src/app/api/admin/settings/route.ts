import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: read + toggle the site-mode flags (coming-soon / maintenance).
// Thin proxy to the Laravel admin API; auth comes from the admin cookie.

export async function GET(): Promise<Response> {
  const res = await adminApi('/admin/settings');
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const res = await adminApi('/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
