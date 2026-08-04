import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Read a booking from its manage link.
 *
 * The token in the URL is the only credential — it is the 64-char random string
 * mailed in the confirmation, never the booking id — so this route must not
 * accept anything else as a lookup key, and Laravel 404s on a miss rather than
 * saying whether the booking exists.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;

  try {
    const res = await laravelFetch(`/booking/manage/${encodeURIComponent(token)}`);
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Could not load that booking.' }, { status: 502 });
  }
}
