import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import AdminTopbar from './AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function BlogsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/jundullah');

  return (
    <div className="adm-shell">
      <AdminTopbar email={session.email} />
      {children}
    </div>
  );
}
