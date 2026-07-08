import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Thin proxy → Laravel stores the enquiry in MySQL and pushes the email to the
// Beehiiv newsletter list. The browser only ever talks to Next (nginx routes
// /api → :3000); Laravel is reached over the loopback.
export async function POST(req: Request) {
  const body = await req.text();

  let res: Response;
  try {
    res = await laravelFetch('/contact', { method: 'POST', body });
  } catch {
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (res.ok) return Response.json({ ok: true }, { status: res.status });

  // Map Laravel's validation shape ({message, errors}) to the {error} the form expects.
  const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;
  const message = firstError ?? data.error ?? data.message ?? 'submission_failed';

  return Response.json({ error: message }, { status: res.status });
}
