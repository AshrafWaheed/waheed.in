import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';
import SiteModeToggles from './SiteModeToggles';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Site mode · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const res = await adminApi('/admin/settings');
  const data = (res.ok ? await res.json().catch(() => null) : null) as
    | { coming_soon?: boolean; maintenance?: boolean }
    | null;

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Site mode</h1>
          <p className="adm-sub">Control what visitors see. You always see the real site.</p>
        </div>
      </header>

      <SiteModeToggles
        initialComingSoon={data?.coming_soon ?? false}
        initialMaintenance={data?.maintenance ?? false}
        initialLoaded={data !== null}
      />
    </div>
  );
}
