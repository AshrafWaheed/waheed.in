import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';
import AvailabilityEditor, { type AvailabilityPayload } from './AvailabilityEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Availability · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function AvailabilityPage() {
  const res = await adminApi('/admin/booking/availability');
  const data = (res.ok ? await res.json().catch(() => null) : null) as AvailabilityPayload | null;

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Availability</h1>
          <p className="adm-sub">
            When people can book you. Times are your local hours — they stay put when clocks change.
          </p>
        </div>
      </header>

      {data ? (
        <AvailabilityEditor initial={data} />
      ) : (
        <p className="adm-form-error">Could not load availability. Try refreshing.</p>
      )}
    </div>
  );
}
