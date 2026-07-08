import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Thin proxy → Laravel subscribes the email to Beehiiv (source of truth) and
// mirrors it in MySQL. Returns the {ok} / {error} contract the forms expect.
export async function POST(req: Request) {
  const body = await req.text();

  let res: Response;
  try {
    res = await laravelFetch('/newsletter', { method: 'POST', body });
  } catch {
    return Response.json({ error: 'Please try again.' }, { status: 502 });
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (res.ok) return Response.json({ ok: true }, { status: res.status });

  const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;
  const message = firstError ?? data.error ?? data.message ?? 'Please try again.';

  return Response.json({ error: message }, { status: res.status });
}
