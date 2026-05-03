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

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return [];

  // Normalize header: lowercase, trim whitespace
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const nameIdx = headers.indexOf('name');
  if (nameIdx === -1) return null; // signal missing required column

  const relationIdx = headers.indexOf('relation');
  const seatsIdx = headers.indexOf('seats');
  const noteIdx = headers.indexOf('note');

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Basic CSV parse — handles quoted fields containing commas
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());

    const name = fields[nameIdx]?.trim();
    if (!name) continue; // skip rows with no name

    rows.push({
      name,
      relation: relationIdx !== -1 ? (fields[relationIdx]?.trim() || '') : '',
      seats: seatsIdx !== -1 ? (parseInt(fields[seatsIdx], 10) || 1) : 1,
      note: noteIdx !== -1 ? (fields[noteIdx]?.trim() || '') : '',
    });
  }

  return rows;
}

// POST — upload CSV, bulk-add guests (admin)
export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded — use field name "file"' }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows === null) {
    return NextResponse.json(
      { error: 'CSV must have a "name" column header' },
      { status: 422 }
    );
  }

  const data = readData();
  const existingSlugs = new Set(data.guests.map((g) => g.slug));

  let added = 0;
  let skipped = 0;
  const newGuests = [];

  for (const row of rows) {
    if (!row.name) {
      skipped++;
      continue;
    }

    const slug = generateSlug(existingSlugs);
    existingSlugs.add(slug); // reserve immediately so next iteration won't collide

    const guest = {
      id: crypto.randomUUID(),
      slug,
      name: row.name,
      relation: row.relation,
      seats: Math.max(1, row.seats),
      note: row.note,
      created_at: new Date().toISOString(),
      url: guestUrl(slug, request),
    };

    data.guests.push(guest);
    newGuests.push(guest);
    added++;
  }

  writeData(data);

  return NextResponse.json({ added, skipped, guests: newGuests }, { status: 201 });
}
