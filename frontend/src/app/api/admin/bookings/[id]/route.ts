import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: one booking plus its audit trail (GET), or its outcome/notes (PATCH).
// Cancelling is NOT here — it has side effects (releasing the slot, deleting
// the Google event) and keeps its own endpoint.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const res = await adminApi(`/admin/bookings/${encodeURIComponent(id)}`);
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const body = await req.text();
  const res = await adminApi(`/admin/bookings/${encodeURIComponent(id)}`, { method: 'PATCH', body });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
