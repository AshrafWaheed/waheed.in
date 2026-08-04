import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Bookable start times for a date range.
 *
 * Returns UTC instants grouped by date in the BUSINESS timezone — the browser
 * renders them in the visitor's zone. The query is forwarded verbatim so
 * Laravel does the validating; there is nothing to guard here that it does not
 * already guard better.
 */
export async function GET(req: Request): Promise<Response> {
  const qs = new URL(req.url).searchParams.toString();

  try {
    const res = await laravelFetch(`/booking/slots?${qs}`);
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Could not load available times.' }, { status: 502 });
  }
}
