import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Users · WAHEED Admin',
  robots: { index: false, follow: false },
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  last_login_at: string | null;
  created_at: string | null;
};

function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function UsersPage() {
  const res = await adminApi('/admin/users');
  const payload = (res.ok ? await res.json().catch(() => null) : null) as { data?: User[] } | null;
  const rows = payload?.data ?? [];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Users</h1>
          <p className="adm-sub">{rows.length} account{rows.length === 1 ? '' : 's'}.</p>
        </div>
      </header>

      <div className="adm-note">
        Admin accounts are managed from the server for safety. To add one, run{' '}
        <code>php artisan admin:create you@waheed.in --name=&quot;Full Name&quot;</code>; to rotate a password,{' '}
        <code>php artisan admin:reset-password you@waheed.in</code>.
      </div>

      {rows.length === 0 ? (
        <div className="adm-placeholder">No users found.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last login</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="adm-table-title">{u.name}</td>
                  <td className="adm-table-muted">{u.email}</td>
                  <td>
                    <span className={`adm-badge adm-badge-${u.role === 'admin' ? 'published' : 'draft'}`}>{u.role}</span>
                  </td>
                  <td className="adm-table-date">{fmt(u.last_login_at)}</td>
                  <td className="adm-table-date">{fmt(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
