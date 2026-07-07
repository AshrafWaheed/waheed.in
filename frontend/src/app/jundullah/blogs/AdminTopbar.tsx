import Link from 'next/link';
import LogoutButton from '../LogoutButton';

export default function AdminTopbar({ email }: { email: string }) {
  return (
    <header className="adm-topbar">
      <div className="adm-topbar-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Waheed" className="adm-topbar-logo" />
        <Link href="/jundullah/blogs" className="adm-topbar-title">
          Insights
        </Link>
        <div className="adm-topbar-right">
          <span className="adm-topbar-user">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
