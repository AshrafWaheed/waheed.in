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

/**
 * Subscribe an email to the Beehiiv publication.
 * ok:true on success (or when Beehiiv isn't configured, falls back to local-only);
 * ok:false with details when the API rejects the request.
 */
async function subscribeToBeehiiv(email: string): Promise<{ ok: boolean; status: number; detail?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId  = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) return { ok: true, status: 0, detail: 'not-configured' };

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email:  true,
      utm_source:          'waheed.in',
      referring_site:      'waheed.in',
    }),
  });

  if (res.ok) return { ok: true, status: res.status };
  const detail = await res.text().catch(() => '');
  return { ok: false, status: res.status, detail };
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: 'invalid email' }, { status: 400 });

  // Push to Beehiiv (source of truth)
  const bh = await subscribeToBeehiiv(email).catch((err) => {
    console.error('[newsletter] beehiiv threw:', err);
    return { ok: false, status: 0, detail: String(err) };
  });
  if (!bh.ok) {
    console.error('[newsletter] beehiiv rejected:', bh.status, bh.detail);
    return Response.json({ error: 'Subscription failed, please try again.' }, { status: 502 });
  }

  // Local backup record (deduped)
  const rows  = load();
  const isNew = !rows.some((r) => r.email === email);
  if (isNew) {
    rows.push({ email, subscribedAt: new Date().toISOString() });
    save(rows);
  }

  // Optional alert email (no-op until SMTP creds are in .env.local)
  const alertTo = process.env.ALERT_TO ?? process.env.SMTP_USER ?? '';
  if (alertTo && isNew) {
    await sendMail({
      to:      alertTo,
      subject: 'New newsletter subscriber, Halal Brand Letters',
      text:    `New subscriber: ${email}\nTotal (local log): ${rows.length}`,
      html:    `<p><strong>New subscriber:</strong> ${email}</p><p>Total (local log): ${rows.length}</p>`,
    }).catch((err) => console.error('[newsletter] mail error:', err));
  }

  return Response.json({ ok: true }, { status: 201 });
}
