import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'dawat.db');

// Ensure data/ directory exists at runtime
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Module-level singleton — one connection for the lifetime of the process
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    with_family INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    rsvp_status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

export interface Guest {
  id: number;
  slug: string;
  name: string;
  with_family: number;
  is_active: number;
  rsvp_status: string;
  created_at: string;
  updated_at: string;
}

export function getAllGuests(): Guest[] {
  return db.prepare('SELECT * FROM guests ORDER BY created_at DESC').all() as Guest[];
}

export function getGuestBySlug(slug: string): Guest | undefined {
  return db.prepare('SELECT * FROM guests WHERE slug = ?').get(slug) as Guest | undefined;
}

export function createGuest(name: string, withFamily: boolean): Guest {
  let slug = nanoid(8);

  // Retry once on the astronomically unlikely slug collision
  if (db.prepare('SELECT id FROM guests WHERE slug = ?').get(slug)) {
    slug = nanoid(8);
  }

  db.prepare(
    'INSERT INTO guests (slug, name, with_family) VALUES (?, ?, ?)'
  ).run(slug, name, withFamily ? 1 : 0);

  return getGuestBySlug(slug) as Guest;
}

export function updateGuest(slug: string, name: string, withFamily: boolean): Guest {
  db.prepare(
    `UPDATE guests SET name = ?, with_family = ?, updated_at = datetime('now') WHERE slug = ?`
  ).run(name, withFamily ? 1 : 0, slug);

  return getGuestBySlug(slug) as Guest;
}

export function toggleGuestActive(slug: string): Guest {
  db.prepare(
    `UPDATE guests SET is_active = 1 - is_active, updated_at = datetime('now') WHERE slug = ?`
  ).run(slug);

  return getGuestBySlug(slug) as Guest;
}

export function submitRsvp(slug: string, status: 'confirmed' | 'declined'): Guest {
  db.prepare(
    `UPDATE guests SET rsvp_status = ?, updated_at = datetime('now') WHERE slug = ?`
  ).run(status, slug);

  return getGuestBySlug(slug) as Guest;
}

export function bulkCreateGuests(
  rows: { name: string; withFamily: boolean }[]
): { inserted: number; failed: number } {
  const existingSlugs = new Set(
    (db.prepare('SELECT slug FROM guests').all() as { slug: string }[]).map((r) => r.slug)
  );

  let inserted = 0;
  let failed = 0;

  const insert = db.prepare(
    'INSERT INTO guests (slug, name, with_family) VALUES (?, ?, ?)'
  );

  const runTransaction = db.transaction(() => {
    for (const row of rows) {
      if (!row.name?.trim()) {
        failed++;
        continue;
      }

      let slug = nanoid(8);
      while (existingSlugs.has(slug)) {
        slug = nanoid(8);
      }
      existingSlugs.add(slug);

      try {
        insert.run(slug, row.name.trim(), row.withFamily ? 1 : 0);
        inserted++;
      } catch {
        failed++;
      }
    }
  });

  runTransaction();

  return { inserted, failed };
}

export function getStats(): {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  inactive: number;
} {
  const row = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN rsvp_status = 'confirmed' AND is_active = 1 THEN 1 ELSE 0 END) AS confirmed,
      SUM(CASE WHEN rsvp_status = 'declined' AND is_active = 1 THEN 1 ELSE 0 END) AS declined,
      SUM(CASE WHEN rsvp_status = 'pending'  AND is_active = 1 THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive
    FROM guests
  `).get() as {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    inactive: number;
  };

  return row;
}
