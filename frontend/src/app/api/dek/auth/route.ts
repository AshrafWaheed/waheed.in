const INVITE_PASSWORD = 'wahg8x7ucinvite';

export async function POST(request: Request) {
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (body.password === INVITE_PASSWORD) {
    return Response.json({ ok: true }, { status: 200 });
  }

  return Response.json({ ok: false }, { status: 401 });
}
