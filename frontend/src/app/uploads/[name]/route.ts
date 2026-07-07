import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_DIR, contentTypeForExt, isSafeUploadName } from '@/lib/uploads';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ name: string }> };

// Serves uploaded images from the gitignored data dir. Public (images aren't
// secret) and reached directly because the proxy skips paths with a file
// extension. Filenames are content-unique, so responses are immutable.
export async function GET(_req: Request, ctx: Ctx) {
  const { name } = await ctx.params;
  if (!isSafeUploadName(name)) {
    return new NextResponse('Not found', { status: 404 });
  }
  const ext = name.split('.').pop() ?? '';
  const contentType = contentTypeForExt(ext);
  if (!contentType) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
