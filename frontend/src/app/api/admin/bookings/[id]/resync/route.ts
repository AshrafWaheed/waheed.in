import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: retry the Google event for a booking whose calendar sync failed — the
// repair path for the deliberate DB-first, Google-second ordering.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const res = await adminApi(`/admin/bookings/${encodeURIComponent(id)}/resync`, { method: 'POST' });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
