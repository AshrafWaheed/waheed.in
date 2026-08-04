import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cancel from the manage link. Idempotent — cancelling an already-cancelled
// booking succeeds quietly, because a double-click must not read as an error.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;

  try {
    const res = await laravelFetch(`/booking/manage/${encodeURIComponent(token)}/cancel`, {
      method: 'POST',
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Could not cancel that booking.' }, { status: 502 });
  }
}
