import type { Metadata } from 'next';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import StackButton from '@/components/ui/StackButton';
import ContactsTable, { type Contact } from './ContactsTable';
import ExportCsvButton from '../ExportCsvButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact submissions · WAHEED Admin',
  robots: { index: false, follow: false },
};

type Payload = {
  data: Contact[];
  meta?: { current_page: number; last_page: number; total: number };
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';
  const page = typeof sp.page === 'string' ? sp.page : '1';

  const query = new URLSearchParams({ page, per_page: '20' });
  if (q) query.set('q', q);

  const res = await adminApi(`/admin/contacts?${query.toString()}`);
  const payload = (res.ok ? await res.json().catch(() => null) : null) as Payload | null;
  const rows = payload?.data ?? [];
  const meta = payload?.meta ?? { current_page: 1, last_page: 1, total: rows.length };

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    p.set('page', String(n));
    return `/jundullah/contacts?${p.toString()}`;
  };

  const csvColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'brand', label: 'Brand' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'service', label: 'Service' },
    { key: 'custom_services', label: 'Custom services' },
    { key: 'stage', label: 'Stage' },
    { key: 'budget', label: 'Budget' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'message', label: 'Message' },
    { key: 'created_at', label: 'Received' },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Contact submissions</h1>
          <p className="adm-sub">{meta.total} enquir{meta.total === 1 ? 'y' : 'ies'} · click a row for full details.</p>
        </div>
        <ExportCsvButton rows={rows} columns={csvColumns} filename="contact-submissions.csv" />
      </header>

      <form className="adm-filters" method="get">
        <input type="search" name="q" defaultValue={q} placeholder="Search name, email or brand…" />
        <StackButton type="submit" size="sm" tone="ghost" className="adm-filter-btn">Search</StackButton>
      </form>

      {rows.length === 0 ? (
        <div className="adm-placeholder">No contact submissions found.</div>
      ) : (
        <ContactsTable rows={rows} />
      )}

      {meta.last_page > 1 && (
        <nav className="adm-pager" aria-label="Pagination">
          {meta.current_page > 1 ? (
            <Link href={pageHref(meta.current_page - 1)} className="adm-link">← Prev</Link>
          ) : (
            <span className="adm-pager-off">← Prev</span>
          )}
          <span className="adm-pager-info">Page {meta.current_page} of {meta.last_page}</span>
          {meta.current_page < meta.last_page ? (
            <Link href={pageHref(meta.current_page + 1)} className="adm-link">Next →</Link>
          ) : (
            <span className="adm-pager-off">Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}
