import { promises as fs } from 'fs';
import path from 'path';

// Uploaded images live in the gitignored data dir (frontend/data/uploads) and
// are served by the /uploads/[name] route handler — because `next start` does
// not serve files added to public/ after the build.
export const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

/** Accepted upload MIME types. */
export const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const EXT_CONTENT_TYPE: Record<string, string> = {
  webp: 'image/webp',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function contentTypeForExt(ext: string): string | null {
  return EXT_CONTENT_TYPE[ext.toLowerCase()] ?? null;
}

/** Guard against path traversal — only flat, known-extension filenames. */
export function isSafeUploadName(name: string): boolean {
  return /^[A-Za-z0-9_-]+\.(webp|gif|jpe?g|png)$/i.test(name);
}
