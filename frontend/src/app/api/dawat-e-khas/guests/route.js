import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), '..', 'data', 'dawat-guests.json');
const ADMIN_PASSWORD = process.env.DAWAT_ADMIN_PASSWORD || 'admin123';
const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function readData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function generateSlug(existingSlugs) {
  let slug;
  do {
    slug = Array.from({ length: 6 }, () =>
      SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)]
    ).join('');
  } while (existingSlugs.has(slug));
  return slug;
}

function isAdmin(request) {
  return request.headers.get('x-admin-password') === ADMIN_PASSWORD;
}

function guestUrl(slug, request) {
  const origin = request.headers.get('origin') || `https://${request.headers.get('host')}`;
  return `${origin}/dawat-e-khas/${slug}`;
}

// GET — public slug lookup OR admin full list
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const data = readData();

  if (slug) {
    const guest = data.guests.find((g) => g.slug === slug);
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }
    return NextResponse.json({ guest, config: data.config });
  }

  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ guests: data.guests, config: data.config });
}

// POST — add a new guest (admin)
export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, relation = '', seats = 1, note = '' } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const data = readData();
  const existingSlugs = new Set(data.guests.map((g) => g.slug));
  const slug = generateSlug(existingSlugs);

  const guest = {
    id: crypto.randomUUID(),
    slug,
    name: name.trim(),
    relation: String(relation).trim(),
    seats: Math.max(1, parseInt(seats, 10) || 1),
    note: String(note).trim(),
    created_at: new Date().toISOString(),
    url: guestUrl(slug, request),
  };

  data.guests.push(guest);
  writeData(data);

  return NextResponse.json({ guest }, { status: 201 });
}

// DELETE — remove a guest by id (admin)
export async function DELETE(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  }

  const data = readData();
  const before = data.guests.length;
  data.guests = data.guests.filter((g) => g.id !== id);

  if (data.guests.length === before) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
  }

  writeData(data);
  return NextResponse.json({ deleted: id });
}

// PATCH — update wedding config (admin)
export async function PATCH(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data = readData();

  const ALLOWED_CONFIG_KEYS = [
    'groom', 'bride', 'date', 'time', 'venue', 'venue_address',
    'host_name', 'rsvp_phone', 'arabic_greeting',
  ];

  for (const key of ALLOWED_CONFIG_KEYS) {
    if (key in body) {
      data.config[key] = body[key];
    }
  }

  writeData(data);
  return NextResponse.json({ config: data.config });
}
