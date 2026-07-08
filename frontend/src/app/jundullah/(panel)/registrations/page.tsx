import type { Metadata } from 'next';
import { getRegistrations } from '@/lib/admin-data';
import ExportCsvButton from '../ExportCsvButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Registrations · WAHEED Admin',
  robots: { index: false, follow: false },
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function RegistrationsPage() {
  const rows = getRegistrations();

  const csvColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'created_at', label: 'Registered' },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Registrations</h1>
          <p className="adm-sub">{rows.length} registration{rows.length === 1 ? '' : 's'}.</p>
        </div>
        <ExportCsvButton rows={rows} columns={csvColumns} filename="registrations.csv" />
      </header>

      {rows.length === 0 ? (
        <div className="adm-placeholder">No registrations yet.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="adm-table-title">{r.name}</td>
                  <td className="adm-table-muted">{r.email}</td>
                  <td>{r.phone || '—'}</td>
                  <td>{r.company || '—'}</td>
                  <td className="adm-table-date">{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
