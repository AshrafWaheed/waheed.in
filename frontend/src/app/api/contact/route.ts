import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE     = path.join(DATA_DIR, 'contact-submissions.json');

interface Submission {
  name:           string;
  email:          string;
  brand:          string;
  whatsapp?:      string;
  location?:      string;
  service:        string;
  customServices: string[];
  stage?:         string;
  budget?:        string;
  message:        string;
  timeline?:      string;
  submittedAt:    string;
}

function load(): Submission[] {
  if (!existsSync(FILE)) return [];
  try { return JSON.parse(readFileSync(FILE, 'utf-8')); }
  catch { return []; }
}

function save(rows: Submission[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(rows, null, 2));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name    = typeof body.name    === 'string' ? body.name.trim()    : '';
  const email   = typeof body.email   === 'string' ? body.email.trim()   : '';
  const brand   = typeof body.brand   === 'string' ? body.brand.trim()   : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name)    return Response.json({ error: 'name is required' },    { status: 400 });
  if (!email)   return Response.json({ error: 'email is required' },   { status: 400 });
  if (!brand)   return Response.json({ error: 'brand is required' },   { status: 400 });
  if (!service) return Response.json({ error: 'service is required' }, { status: 400 });
  if (!message) return Response.json({ error: 'message is required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'invalid email' }, { status: 400 });
  }

  const submission: Submission = {
    name,
    email:          email.toLowerCase(),
    brand,
    whatsapp:       typeof body.whatsapp === 'string' ? body.whatsapp.trim() : undefined,
    location:       typeof body.location === 'string' ? body.location.trim() : undefined,
    service,
    customServices: Array.isArray(body.customServices) ? (body.customServices as string[]) : [],
    stage:          typeof body.stage    === 'string' ? body.stage.trim()    : undefined,
    budget:         typeof body.budget   === 'string' ? body.budget.trim()   : undefined,
    message,
    timeline:       typeof body.timeline === 'string' ? body.timeline.trim() : undefined,
    submittedAt:    new Date().toISOString(),
  };

  const rows = load();
  rows.push(submission);
  save(rows);

  return Response.json({ ok: true }, { status: 201 });
}
