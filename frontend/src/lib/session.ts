// ── Admin session cookie (signed, runtime-agnostic) ───────────────────────────
// A single signed cookie carries the admin identity + the Laravel bearer token.
// It is verified with Web Crypto (HMAC-SHA256) so the SAME code runs in both the
// proxy (edge/node boundary) and Node route handlers. The proxy only needs the
// signature + role to grant the coming-soon bypass; route handlers additionally
// read `token` to call Laravel. Value format: base64url(payload).base64url(sig)
//
// NOTE: signed, not encrypted — the payload (incl. the Laravel token) is readable
// by anyone who can read the raw cookie. It is HttpOnly + Secure + SameSite=Lax,
// so it is never exposed to client JS. (Encrypting the payload is a B12 item.)

export const ADMIN_COOKIE = 'waheed_admin';

/** 7 days, matching the Laravel token TTL. */
export const ADMIN_COOKIE_MAXAGE = 7 * 24 * 60 * 60;

export type AdminSession = {
  uid: number;
  name: string;
  email: string;
  role: string;
  token: string; // Laravel Sanctum bearer token — server-side use only
  exp: number; // unix seconds
};

const encoder = new TextEncoder();

function secret(): string {
  const s = process.env.APP_PREVIEW_SECRET;
  if (!s) throw new Error('APP_PREVIEW_SECRET is not set');
  return s;
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (str.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Copy a view into a fresh ArrayBuffer (satisfies Web Crypto's BufferSource typing). */
function ab(view: Uint8Array): ArrayBuffer {
  const buf = new ArrayBuffer(view.byteLength);
  new Uint8Array(buf).set(view);
  return buf;
}

async function hmacKey(usages: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', ab(encoder.encode(secret())), { name: 'HMAC', hash: 'SHA-256' }, false, usages);
}

/** Create a signed session cookie value. */
export async function signSession(input: Omit<AdminSession, 'exp'>, ttlSeconds = ADMIN_COOKIE_MAXAGE): Promise<string> {
  const payload: AdminSession = { ...input, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab(encoder.encode(body))));
  return `${body}.${toBase64Url(sig)}`;
}

/** Verify + decode a session cookie value. Returns null if invalid or expired. */
export async function verifySession(value?: string | null): Promise<AdminSession | null> {
  if (!value || !value.includes('.')) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  try {
    const key = await hmacKey(['verify']);
    const ok = await crypto.subtle.verify('HMAC', key, ab(fromBase64Url(sig)), ab(encoder.encode(body)));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as AdminSession;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Cookie options shared by set/clear (used in route handlers). */
export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
