import type { Metadata } from 'next';
import { adminApi } from '@/lib/admin-api';
import GooglePanel, { type GoogleStatus } from './GooglePanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Google Calendar · WAHEED Admin',
  robots: { index: false, follow: false },
};

/**
 * The Google connection panel for the booking module.
 *
 * The banner at the top is fed by ?google=&message=, which is how the OAuth
 * callback at /api/google/auth/callback reports back — it is a browser
 * redirect, so it has nowhere else to put its result.
 */
export default async function GoogleSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string; message?: string }>;
}) {
  const { google, message } = await searchParams;

  const res = await adminApi('/admin/google/status');
  const status = (res.ok ? await res.json().catch(() => null) : null) as GoogleStatus | null;

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Google Calendar</h1>
          <p className="adm-sub">
            The account booked calls land on. Every booking creates a real calendar event with a
            Google Meet link.
          </p>
        </div>
      </header>

      <GooglePanel
        initial={status}
        flash={google ? { kind: google, message: message ?? '' } : null}
      />
    </div>
  );
}
