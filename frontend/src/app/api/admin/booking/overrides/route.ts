import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: add a one-off exception (a closed day, or custom hours for one date).
// Responds with the full refreshed availability payload, so the screen never
// has to re-fetch after a write.

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const res = await adminApi('/admin/booking/overrides', { method: 'POST', body });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
