import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { sendMail } from '@/lib/mailer';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE     = path.join(DATA_DIR, 'newsletter-subscribers.json');

interface Subscriber { email: string; subscribedAt: string; }

function load(): Subscriber[] {
  if (!existsSync(FILE)) return [];
  try { return JSON.parse(readFileSync(FILE, 'utf-8')); }
  catch { return []; }
}

function save(rows: Subscriber[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(rows, null, 2));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: 'invalid email' }, { status: 400 });

  const rows = load();
  if (rows.some(r => r.email === email))
    return Response.json({ ok: true, alreadySubscribed: true }, { status: 200 });

  rows.push({ email, subscribedAt: new Date().toISOString() });
  save(rows);

  // Alert email (no-op until SMTP creds are in .env.local)
  const alertTo = process.env.ALERT_TO ?? process.env.SMTP_USER ?? '';
  if (alertTo) {
    await sendMail({
      to:      alertTo,
      subject: 'New newsletter subscriber — Halal Brand Letters',
      text:    `New subscriber: ${email}\nTotal subscribers: ${rows.length}`,
      html:    `<p><strong>New subscriber:</strong> ${email}</p><p>Total: ${rows.length}</p>`,
    }).catch(err => console.error('[newsletter] mail error:', err));
  }

  return Response.json({ ok: true }, { status: 201 });
}
