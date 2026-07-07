// Server-side client for the Laravel API (BFF). Called only from Next.js route
// handlers / server components — never the browser. Talks to Laravel over the
// internal loopback address, bypassing nginx.

const BASE = process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:8000/api';

type LaravelInit = Omit<RequestInit, 'headers'> & {
  token?: string;
  headers?: Record<string, string>;
};

export async function laravelFetch(path: string, init: LaravelInit = {}): Promise<Response> {
  const { token, headers, ...rest } = init;
  return fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });
}
