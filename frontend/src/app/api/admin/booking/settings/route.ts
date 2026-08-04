import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: business timezone + whether Google's busy blocks are subtracted.
export async function PATCH(request: Request): Promise<Response> {
  const body = await request.text();
  const res = await adminApi('/admin/booking/settings', { method: 'PATCH', body });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
