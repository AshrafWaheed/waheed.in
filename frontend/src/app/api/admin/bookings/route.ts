import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: the booked-calls list. Query is forwarded verbatim (scope, q, page).
export async function GET(req: Request): Promise<Response> {
  const qs = new URL(req.url).searchParams.toString();
  const res = await adminApi(`/admin/bookings${qs ? `?${qs}` : ''}`);
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
