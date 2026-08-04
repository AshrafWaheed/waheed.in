import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/laravel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Take a booking. Thin proxy → Laravel writes the row, then puts the event on
 * Google Calendar and mints the Meet link.
 *
 * Two status codes the UI must handle distinctly:
 *   409  the slot was taken between the visitor loading it and submitting —
 *        the page should refresh its slots and say so, not show a generic error
 *   422  validation, including "that time is no longer available"
 */
export async function POST(req: Request): Promise<Response> {
  const body = await req.text();

  let res: Response;
  try {
    res = await laravelFetch('/booking', {
      method: 'POST',
      body,
      // Forwarded so Laravel's throttle and the audit trail see the real
      // visitor rather than the loopback address.
      headers: {
        'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? '',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 502 },
    );
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (res.ok) return NextResponse.json(data, { status: res.status });

  // Flatten Laravel's {message, errors} into the {error} the form renders.
  const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;

  return NextResponse.json(
    {
      error: firstError ?? data.error ?? data.message ?? 'Could not book that time.',
      code: (data as { code?: string }).code,
    },
    { status: res.status },
  );
}
