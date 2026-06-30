import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'registrations.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    company TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export function createRegistration(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
}): { ok: boolean; alreadyExists: boolean } {
  const existing = db.prepare('SELECT id FROM registrations WHERE email = ?').get(data.email);
  if (existing) return { ok: true, alreadyExists: true };

  db.prepare(
    'INSERT INTO registrations (name, email, phone, company) VALUES (?, ?, ?, ?)'
  ).run(data.name, data.email, data.phone, data.company);

  return { ok: true, alreadyExists: false };
}

export function getAllRegistrations() {
  return db.prepare('SELECT id, name, email, phone, company, created_at FROM registrations ORDER BY created_at DESC').all();
}
