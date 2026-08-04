import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// What can be booked, and the business timezone the calendar is authored in.
export async function GET(): Promise<Response> {
  try {
    const res = await laravelFetch('/booking/types');
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Could not load booking types.' }, { status: 502 });
  }
}
