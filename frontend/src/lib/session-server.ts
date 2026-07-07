import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession, type AdminSession } from './session';

// Reads + verifies the admin session from the request cookies.
// For route handlers and server components only (imports `next/headers`).
// The proxy must NOT import this — it reads cookies via `request.cookies`.
export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifySession(jar.get(ADMIN_COOKIE)?.value);
}
