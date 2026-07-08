import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';
import { getSession } from '@/lib/session-server';
import UsersManager, { type ManagedUser } from './UsersManager';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Users · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function UsersPage() {
  const [res, session] = await Promise.all([adminApi('/admin/users'), getSession()]);
  const payload = (res.ok ? await res.json().catch(() => null) : null) as { data?: ManagedUser[] } | null;
  const users = payload?.data ?? [];

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Users</h1>
          <p className="adm-sub">{users.length} account{users.length === 1 ? '' : 's'} with access to this portal.</p>
        </div>
      </header>

      <UsersManager users={users} currentUserId={session?.uid ?? 0} />
    </div>
  );
}
