import type { Metadata } from 'next';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { CalendarCheck, CalendarX, ChevronRight, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings · WAHEED Admin',
  robots: { index: false, follow: false },
};

/**
 * Booking module home.
 *
 * Deliberately thin for now: the Google connection is the only part that
 * exists, and this page says so rather than dressing up screens that are not
 * built. The bookings table, availability editor and call-type settings land in
 * later sessions and replace this body.
 */
export default async function BookingsPage() {
  const res = await adminApi('/admin/google/status');
  const google = (res.ok ? await res.json().catch(() => null) : null) as
    | { connected?: boolean; email?: string }
    | null;

  const connected = !!google?.connected;

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Bookings</h1>
          <p className="adm-sub">Calls booked from the site, and the calendar they land on.</p>
        </div>
      </header>

      <Link href="/jundullah/bookings/google" className={`adm-mode-status adm-mode-status--${connected ? 'live' : 'warn'}`} style={{ textDecoration: 'none' }}>
        {connected ? <CalendarCheck size={18} /> : <CalendarX size={18} />}
        <div style={{ flex: 1 }}>
          <strong>Google Calendar {connected ? '· connected' : '· not connected'}</strong>
          <span>
            {connected
              ? `Booked calls create events on ${google?.email ?? 'the connected account'} with a Meet link.`
              : 'Connect a Google account before opening bookings to the public.'}
          </span>
        </div>
        <ChevronRight size={18} />
      </Link>

      <Link href="/jundullah/bookings/availability" className="adm-mode-status adm-mode-status--idle" style={{ textDecoration: 'none' }}>
        <Clock size={18} />
        <div style={{ flex: 1 }}>
          <strong>Availability</strong>
          <span>Your weekly hours, days off, and how the call itself is scheduled.</span>
        </div>
        <ChevronRight size={18} />
      </Link>

      <div className="adm-note">
        <h3>Still being built</h3>
        <p>
          The database, the Google connection and the availability rules are live. The list of
          booked calls and the public booking page are the next steps — nothing is exposed to
          visitors yet, so no one can book while this is half-finished.
        </p>
      </div>
    </div>
  );
}
