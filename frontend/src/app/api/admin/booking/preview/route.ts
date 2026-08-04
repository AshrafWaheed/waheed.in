import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: what the current rules actually produce for the next fortnight. The
// screen shows the result rather than asking the admin to picture how buffers,
// caps, notice and the real calendar combine.
export async function GET(): Promise<Response> {
  const res = await adminApi('/admin/booking/preview');
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
