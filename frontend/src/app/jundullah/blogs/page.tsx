import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import LogoutButton from '../LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function BlogsDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/jundullah');

  return (
    <main className="adm-shell">
      <header className="adm-topbar">
        <div className="adm-topbar-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Waheed" className="adm-topbar-logo" />
          <span className="adm-topbar-title">Insights</span>
          <div className="adm-topbar-right">
            <span className="adm-topbar-user">{session.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="adm-main">
        <h1 className="adm-h1">
          Assalamu alaikum, <em>{session.name || 'Admin'}</em>
        </h1>
        <p className="adm-lede">
          You are signed in to the WAHEED admin portal. The full Insights manager — create, edit and
          publish posts — arrives in the next session.
        </p>
        <div className="adm-placeholder">Blog manager coming soon (Session B6)</div>
      </section>
    </main>
  );
}
