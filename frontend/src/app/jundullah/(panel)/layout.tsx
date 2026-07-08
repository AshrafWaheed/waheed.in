import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import AdminSidebar from './AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/jundullah');

  return (
    <div className="adm-app">
      <AdminSidebar name={session.name} email={session.email} />
      <main className="adm-content">{children}</main>
    </div>
  );
}
