import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import { adminApi } from '@/lib/admin-api';
import AdminSidebar from './AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/jundullah');

  // The cookie is validly signed, but confirm the Sanctum token it carries is
  // still accepted by Laravel. If it was revoked (password change, token
  // cleanup), every API call would 401 and the panel would look broken — so
  // catch it here and bounce to a clean re-login instead.
  const me = await adminApi('/admin/me');
  if (me.status === 401) redirect('/api/admin/expire');

  return (
    <div className="adm-app">
      <AdminSidebar name={session.name} email={session.email} />
      <main className="adm-content">{children}</main>
    </div>
  );
}
