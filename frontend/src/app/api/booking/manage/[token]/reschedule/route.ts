import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Move a booking from the manage link. Same 409/422 split as booking afresh:
// 409 means someone else took the new slot mid-flight.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;
  const body = await req.text();

  let res: Response;
  try {
    res = await laravelFetch(`/booking/manage/${encodeURIComponent(token)}/reschedule`, {
      method: 'POST',
      body,
    });
  } catch {
    return NextResponse.json({ error: 'Could not move that booking.' }, { status: 502 });
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
    code?: string;
  };

  if (res.ok) return NextResponse.json(data, { status: res.status });

  const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;

  return NextResponse.json(
    { error: firstError ?? data.error ?? data.message ?? 'Could not move that booking.', code: data.code },
    { status: res.status },
  );
}
