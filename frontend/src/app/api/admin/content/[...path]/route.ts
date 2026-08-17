import { NextResponse } from 'next/server';
import { adminApi } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * BFF proxy for the content engine (documents/CONTENT_ENGINE.md).
 *
 * A catch-all rather than the one-file-per-route pattern used elsewhere in this
 * directory: every content endpoint is the same forward-the-body-and-status
 * proxy, and eight identical files would be eight places to fix a bug. The
 * allowlist below keeps that from becoming an open relay into the Laravel admin
 * API — only these exact shapes are forwarded.
 */
const ALLOWED: ReadonlyArray<RegExp> = [
  /^status$/,
  /^topics$/,
  /^topics\/\d+\/generate$/,
  /^drafts\/\d+$/,
  /^drafts\/\d+\/revise$/,
  /^claims\/\d+\/verify$/,
];

function resolve(path: string[]): string | null {
  const joined = path.join('/');
  return ALLOWED.some((re) => re.test(joined)) ? `/admin/content/${joined}` : null;
}

async function proxy(req: Request, path: string[], method: string) {
  const target = resolve(path);
  if (!target) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }

  // Generation turns are research-heavy and legitimately run for minutes; the
  // Laravel side caps them (content.claude.timeout) so this just has to wait.
  const body = method === 'GET' || method === 'DELETE' ? undefined : await req.text();
  const search = new URL(req.url).search;

  const res = await adminApi(`${target}${search}`, { method, ...(body ? { body } : {}) });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).path, 'GET');
}

export async function POST(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).path, 'POST');
}

export async function DELETE(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).path, 'DELETE');
}
