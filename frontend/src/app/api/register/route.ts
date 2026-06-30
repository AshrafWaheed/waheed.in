import { createRegistration } from '../../../../lib/registrations-db';

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; phone?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, company } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return Response.json({ error: 'email is required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return Response.json({ error: 'invalid email' }, { status: 400 });
  }

  const result = createRegistration({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: typeof phone === 'string' ? phone.trim() : '',
    company: typeof company === 'string' ? company.trim() : '',
  });

  if (result.alreadyExists) {
    return Response.json({ error: 'already_registered' }, { status: 409 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
