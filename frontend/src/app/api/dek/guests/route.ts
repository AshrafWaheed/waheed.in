import { getAllGuests, getStats, createGuest } from '../../../../../lib/dek-db';

export async function GET() {
  const guests = getAllGuests();
  const stats = getStats();
  return Response.json({ guests, stats }, { status: 200 });
}

export async function POST(request: Request) {
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

  const guest = createGuest(name.trim(), Boolean(with_family));
  return Response.json({ guest }, { status: 201 });
}
