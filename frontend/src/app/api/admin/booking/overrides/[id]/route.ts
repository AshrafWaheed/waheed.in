import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: remove a date exception.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const res = await adminApi(`/admin/booking/overrides/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
