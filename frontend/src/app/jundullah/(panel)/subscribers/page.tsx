import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';
import ExportCsvButton from '../ExportCsvButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Subscribers · WAHEED Admin',
  robots: { index: false, follow: false },
};

type Subscriber = {
  id: number;
  email: string;
  source: string;
  beehiiv_status: string | null;
  created_at: string;
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function SubscribersPage() {
  const res = await adminApi('/admin/subscribers');
  const payload = (res.ok ? await res.json().catch(() => null) : null) as { data?: Subscriber[] } | null;
  const rows = payload?.data ?? [];

  const csvColumns = [
    { key: 'email', label: 'Email' },
    { key: 'source', label: 'Source' },
    { key: 'beehiiv_status', label: 'Beehiiv status' },
    { key: 'created_at', label: 'Subscribed' },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Subscribers</h1>
          <p className="adm-sub">
            {rows.length} subscriber{rows.length === 1 ? '' : 's'} · mirrored locally from the Beehiiv list.
          </p>
        </div>
        <ExportCsvButton rows={rows} columns={csvColumns} filename="subscribers.csv" />
      </header>

      {rows.length === 0 ? (
        <div className="adm-placeholder">No subscribers yet.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Source</th>
                <th>Beehiiv</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="adm-table-title">{s.email}</td>
                  <td><span className="adm-chip2">{s.source}</span></td>
                  <td>
                    <span className={`adm-badge adm-badge-${s.beehiiv_status === 'synced' ? 'published' : 'draft'}`}>
                      {s.beehiiv_status ?? '—'}
                    </span>
                  </td>
                  <td className="adm-table-date">{fmt(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
