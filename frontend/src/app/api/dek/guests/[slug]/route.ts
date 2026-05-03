import { getGuestBySlug, updateGuest, toggleGuestActive } from '../../../../../../lib/dek-db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);

  if (!guest) {
    return Response.json({ error: 'Guest not found' }, { status: 404 });
  }

  if (guest.is_active === 0) {
    return Response.json({ error: 'Invitation not active' }, { status: 404 });
  }

  return Response.json({ guest }, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!getGuestBySlug(slug)) {
    return Response.json({ error: 'Guest not found' }, { status: 404 });
  }

  let body: { name?: unknown; with_family?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, with_family } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  const guest = updateGuest(slug, name.trim(), Boolean(with_family));
  return Response.json({ guest }, { status: 200 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!getGuestBySlug(slug)) {
    return Response.json({ error: 'Guest not found' }, { status: 404 });
  }

  const guest = toggleGuestActive(slug);
  return Response.json({ guest }, { status: 200 });
}
