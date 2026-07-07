import { getSession } from './session-server';
import { laravelFetch } from './laravel';

// Authenticated server-side call to the Laravel admin API, using the bearer
// token from the current admin session cookie. For server components + route
// handlers only (imports next/headers via getSession). Fails closed with 401.
export async function adminApi(
  path: string,
  init: Parameters<typeof laravelFetch>[1] = {},
): Promise<Response> {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthenticated.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return laravelFetch(path, { ...init, token: session.token });
}
