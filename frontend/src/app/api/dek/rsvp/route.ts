import { getGuestBySlug, submitRsvp } from '../../../../../lib/dek-db';

export async function POST(request: Request) {
  let body: { slug?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { slug, status } = body;

  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return Response.json({ error: 'slug is required' }, { status: 400 });
  }

  if (status !== 'confirmed' && status !== 'declined') {
    return Response.json(
      { error: 'status must be "confirmed" or "declined"' },
      { status: 400 }
    );
  }

  const guest = getGuestBySlug(slug.trim());

  if (!guest || guest.is_active === 0) {
    return Response.json({ error: 'Guest not found' }, { status: 404 });
  }

  if (guest.rsvp_status === 'confirmed' || guest.rsvp_status === 'declined') {
    return Response.json({ error: 'RSVP already submitted' }, { status: 409 });
  }

  const updated = submitRsvp(slug.trim(), status);
  return Response.json({ guest: updated }, { status: 200 });
}
