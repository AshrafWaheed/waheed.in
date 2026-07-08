import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My profile · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/jundullah');

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">My profile</h1>
          <p className="adm-sub">Update your name, email, and password.</p>
        </div>
      </header>

      <ProfileForm initialName={session.name} initialEmail={session.email} />
    </div>
  );
}
