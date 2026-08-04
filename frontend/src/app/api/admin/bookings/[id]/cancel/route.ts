import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: cancel on the client's behalf. Releases the slot and removes the Google
// event; the booking's audit trail records both outcomes.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const res = await adminApi(`/admin/bookings/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
