import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: end-to-end connection test. Laravel creates a throwaway calendar event
// ten years out, checks a Meet link came back, and deletes it again — proving
// token refresh, the Calendar API and Meet minting all work before a real
// customer is the one who finds out they don't.

export async function POST(): Promise<Response> {
  const res = await adminApi('/admin/google/test', { method: 'POST' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
