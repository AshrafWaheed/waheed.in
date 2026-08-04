import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: mint a Google consent URL for the current admin. Laravel parks a
// single-use `state` in the cache before answering, so the URL cannot be
// reused or forged — the panel just sends the browser wherever this points.

export async function GET(): Promise<Response> {
  const res = await adminApi('/admin/google/connect');
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
