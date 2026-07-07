import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { getSession } from '@/lib/session-server';
import { UPLOAD_DIR, ALLOWED_MIME, MAX_UPLOAD_BYTES, ensureUploadDir } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: 'Invalid form data.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'No file provided.' }, { status: 422 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ message: 'Unsupported file type. Use JPG, PNG, WebP or GIF.' }, { status: 422 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ message: 'File too large (max 8 MB).' }, { status: 422 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  await ensureUploadDir();

  let output: Buffer;
  let ext: string;
  try {
    if (file.type === 'image/gif') {
      // Preserve animation — store the original bytes.
      output = input;
      ext = 'gif';
    } else {
      // Normalise orientation, cap width, re-encode to WebP.
      output = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      ext = 'webp';
    }
  } catch {
    return NextResponse.json({ message: 'Could not process the image.' }, { status: 422 });
  }

  const name = `${nanoid(12)}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), output);

  return NextResponse.json({ url: `/uploads/${name}` });
}
