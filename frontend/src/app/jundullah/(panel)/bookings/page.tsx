import type { Metadata } from 'next';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { CalendarCheck, CalendarX, ChevronRight, Clock } from 'lucide-react';
import BookingsTable, { type BookingsPayload } from './BookingsTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function BookingsPage() {
  const [bookingsRes, googleRes] = await Promise.all([
    adminApi('/admin/bookings?scope=upcoming'),
    adminApi('/admin/google/status'),
  ]);

  const payload = (bookingsRes.ok ? await bookingsRes.json().catch(() => null) : null) as BookingsPayload | null;
  const google = (googleRes.ok ? await googleRes.json().catch(() => null) : null) as
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

      {/* Google being disconnected is not a footnote — every new booking would
          land without a Meet link, so it leads the page when it is wrong. */}
      {!connected && (
        <Link href="/jundullah/bookings/google" className="adm-mode-status adm-mode-status--warn" style={{ textDecoration: 'none' }}>
          <CalendarX size={18} />
          <div style={{ flex: 1 }}>
            <strong>Google Calendar is not connected</strong>
            <span>New bookings will be saved but will not get a calendar event or a Meet link.</span>
          </div>
          <ChevronRight size={18} />
        </Link>
      )}

      {payload ? (
        <BookingsTable initial={payload} />
      ) : (
        <p className="adm-form-error">Could not load bookings. Try refreshing.</p>
      )}

      <div className="bkl-links">
        <Link href="/jundullah/bookings/availability" className="adm-mode-status adm-mode-status--idle" style={{ textDecoration: 'none' }}>
          <Clock size={18} />
          <div style={{ flex: 1 }}>
            <strong>Availability</strong>
            <span>Weekly hours, days off, and how the call is scheduled.</span>
          </div>
          <ChevronRight size={18} />
        </Link>

        <Link href="/jundullah/bookings/google" className={`adm-mode-status adm-mode-status--${connected ? 'live' : 'warn'}`} style={{ textDecoration: 'none' }}>
          <CalendarCheck size={18} />
          <div style={{ flex: 1 }}>
            <strong>Google Calendar</strong>
            <span>{connected ? `Connected · ${google?.email}` : 'Not connected'}</span>
          </div>
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
