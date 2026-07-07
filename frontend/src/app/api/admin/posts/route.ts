import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create a post (forwards the JSON body to Laravel).
export async function POST(req: Request) {
  const body = await req.text();
  const res = await adminApi('/admin/posts', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
