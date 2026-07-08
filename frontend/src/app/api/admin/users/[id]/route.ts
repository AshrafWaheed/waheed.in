import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// Update a user's name / email.
export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.text();
  const res = await adminApi(`/admin/users/${id}`, { method: 'PATCH', body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

// Delete a user.
export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await adminApi(`/admin/users/${id}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
