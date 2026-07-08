import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// Reset a user's password (given or random).
export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.text();
  const res = await adminApi(`/admin/users/${id}/password`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
