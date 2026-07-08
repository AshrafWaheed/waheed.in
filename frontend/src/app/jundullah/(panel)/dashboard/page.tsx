import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Inbox, Mail, ClipboardList, Users, FileEdit } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { getRegistrations } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard · WAHEED Admin',
  robots: { index: false, follow: false },
};

async function apiJson(path: string): Promise<{ data?: unknown[]; meta?: { total?: number } } | null> {
  const res = await adminApi(path);
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

async function totalFrom(path: string): Promise<number> {
  const j = await apiJson(path);
  return j?.meta?.total ?? (Array.isArray(j?.data) ? j!.data!.length : 0);
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type ContactRow = { id: number; name: string; brand: string; service: string; created_at: string };
type PostRow = { id: number; title: string; status: string; published_at: string | null; updated_at: string | null };

export default async function DashboardPage() {
  const registrations = getRegistrations();

  const [published, drafts, contactsTotal, subscribers, users, recentContactsJson, recentPostsJson] =
    await Promise.all([
      totalFrom('/admin/posts?status=published&per_page=1'),
      totalFrom('/admin/posts?status=draft&per_page=1'),
      totalFrom('/admin/contacts?per_page=1'),
      totalFrom('/admin/subscribers'),
      totalFrom('/admin/users'),
      apiJson('/admin/contacts?per_page=5'),
      apiJson('/admin/posts?per_page=5'),
    ]);

  const recentContacts = (recentContactsJson?.data as ContactRow[] | undefined) ?? [];
  const recentPosts = (recentPostsJson?.data as PostRow[] | undefined) ?? [];

  const stats = [
    { label: 'Published', value: published, href: '/jundullah/blogs?status=published', icon: Newspaper },
    { label: 'Drafts', value: drafts, href: '/jundullah/blogs?status=draft', icon: FileEdit },
    { label: 'Contact submissions', value: contactsTotal, href: '/jundullah/contacts', icon: Inbox },
    { label: 'Subscribers', value: subscribers, href: '/jundullah/subscribers', icon: Mail },
    { label: 'Registrations', value: registrations.length, href: '/jundullah/registrations', icon: ClipboardList },
    { label: 'Users', value: users, href: '/jundullah/users', icon: Users },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Dashboard</h1>
          <p className="adm-sub">An overview of everything happening across the site.</p>
        </div>
      </header>

      <div className="adm-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="adm-stat">
            <s.icon size={20} className="adm-stat-icon" />
            <span className="adm-stat-value">{s.value}</span>
            <span className="adm-stat-label">{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="adm-dash-cols">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Recent contact submissions</h2>
            <Link href="/jundullah/contacts" className="adm-link">View all →</Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="adm-empty2">No submissions yet.</p>
          ) : (
            <ul className="adm-mini-list">
              {recentContacts.map((c) => (
                <li key={c.id}>
                  <span className="adm-mini-title">{c.name}</span>
                  <span className="adm-mini-meta">{c.brand} · {c.service}</span>
                  <span className="adm-mini-date">{fmtDate(c.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Recent posts</h2>
            <Link href="/jundullah/blogs" className="adm-link">View all →</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="adm-empty2">No posts yet.</p>
          ) : (
            <ul className="adm-mini-list">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/jundullah/blogs/${p.id}/edit`} className="adm-mini-title adm-mini-link">{p.title}</Link>
                  <span className={`adm-badge adm-badge-${p.status}`}>{p.status}</span>
                  <span className="adm-mini-date">{fmtDate(p.published_at ?? p.updated_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
