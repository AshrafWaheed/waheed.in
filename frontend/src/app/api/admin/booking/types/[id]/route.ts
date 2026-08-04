import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: the call type's scheduling knobs — duration, buffers, notice, horizon, cap.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const body = await request.text();
  const res = await adminApi(`/admin/booking/types/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body,
  });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
