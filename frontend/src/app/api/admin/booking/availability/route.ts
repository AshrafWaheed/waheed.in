import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

// BFF: the whole availability screen in one payload, and a wholesale save of
// the weekly grid. PUT replaces every global rule — see the controller for why
// a grid editor saves as a unit rather than diffing rows.

export async function GET(): Promise<Response> {
  const res = await adminApi('/admin/booking/availability');
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}

export async function PUT(request: Request): Promise<Response> {
  const body = await request.text();
  const res = await adminApi('/admin/booking/availability', { method: 'PUT', body });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
