// Server-only reader for the admin dashboard's SQLite-backed registrations.
// (Contacts + subscribers now live in MySQL and are read via the Laravel admin
// API.) Registrations remain in a SQLite DB written by the public /api/register
// route. Under data/ (gitignored). Never import this from client components.
import { existsSync } from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

/** Registrations from the SQLite DB, newest first. Empty if the DB is absent. */
export function getRegistrations(): Registration[] {
  const p = path.join(DATA_DIR, 'registrations.db');
  if (!existsSync(p)) return [];
  let db: Database.Database | null = null;
  try {
    db = new Database(p, { readonly: true });
    return db
      .prepare('SELECT id, name, email, phone, company, created_at FROM registrations ORDER BY created_at DESC')
      .all() as Registration[];
  } catch {
    return [];
  } finally {
    db?.close();
  }
}
