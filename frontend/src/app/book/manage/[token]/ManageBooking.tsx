'use client';

/**
 * Move or cancel a booking from the link in its confirmation email.
 *
 * The token in the URL is the whole credential, so this screen shows only what
 * the person who booked already knows, and every action goes back through the
 * same token — there is no id in play that could be guessed or incremented.
 *
 * Rescheduling reuses {@see SlotPicker}, so the times offered here are exactly
 * the times the booking page would offer. A separate implementation would
 * eventually disagree with it, and the user would be the one to find out.
 */

import { useState, useEffect, useCallback } from 'react';
import { Video, Loader2, CalendarDays, Check, X, ArrowLeft } from 'lucide-react';
import SlotPicker from '../../SlotPicker';

interface Booking {
  uid: string; status: string; name: string; email: string;
  starts_at: string; ends_at: string; visitor_tz: string;
  meet_url: string | null; manage_token: string;
  type: { name: string; duration_min: number };
}
interface CallType { slug: string; horizon_days: number }

export default function ManageBooking({ token }: { token: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [type, setType] = useState<CallType | null>(null);
  const [businessTz, setBusinessTz] = useState('UTC');
  const [visitorTz, setVisitorTz] = useState('UTC');
  const [showTz, setShowTz] = useState('UTC');

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<'view' | 'reschedule'>('view');
  const [slot, setSlot] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busy, setBusy] = useState<'cancel' | 'move' | null>(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setVisitorTz(tz); setShowTz(tz);

    (async () => {
      try {
        const [bRes, tRes] = await Promise.all([
          fetch(`/api/booking/manage/${token}`, { cache: 'no-store' }),
          fetch('/api/booking/types', { cache: 'no-store' }),
        ]);

        if (bRes.status === 404) { setNotFound(true); return; }
        if (!bRes.ok) throw new Error();

        const bData = (await bRes.json()) as { booking: Booking };
        setBooking(bData.booking);

        const tData = (await tRes.json()) as { timezone: string; types: CallType[] };
        setBusinessTz(tData.timezone);
        setType(tData.types[0] ?? null);
      } catch {
        setError('Could not load that booking. Please try the link again, or email info@waheed.in.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const fmtLong = useCallback((iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', timeZone: showTz,
    }).format(new Date(iso)), [showTz]);

  async function cancel() {
    if (!confirm('Cancel this call? You can always book another time.')) return;
    setBusy('cancel'); setError('');
    try {
      const res = await fetch(`/api/booking/manage/${token}/cancel`, { method: 'POST' });
      const data = (await res.json()) as { booking?: Booking; error?: string };
      if (!res.ok || !data.booking) throw new Error(data.error ?? 'Could not cancel.');
      setBooking(data.booking);
      setMode('view');
      setFlash('Your call has been cancelled.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not cancel.');
    } finally {
      setBusy(null);
    }
  }

  async function move() {
    if (!slot) return;
    setBusy('move'); setError('');
    try {
      const res = await fetch(`/api/booking/manage/${token}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starts_at: slot }),
      });
      const data = (await res.json()) as { booking?: Booking; error?: string; code?: string };

      if (res.status === 409 || data.code === 'slot_taken') {
        setSlot(null);
        setRefreshKey((k) => k + 1);
        setError('Someone took that time while you were choosing. Here are the times still free.');
        return;
      }
      if (!res.ok || !data.booking) throw new Error(data.error ?? 'Could not move the call.');

      setBooking(data.booking);
      setSlot(null);
      setMode('view');
      setFlash('Your call has been moved. A fresh calendar invitation is on its way.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not move the call.');
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="bk-card"><p className="bk-times-empty"><Loader2 size={15} className="bk-spin" /> Loading your booking…</p></div>;
  }

  if (notFound) {
    return (
      <div className="bk-card bk-done">
        <h2>We couldn&apos;t find that booking.</h2>
        <p className="bk-done-p">
          The link may have expired, or the call may already have been cancelled. If you think
          that&apos;s wrong, email <a href="mailto:info@waheed.in">info@waheed.in</a> and we&apos;ll
          sort it out.
        </p>
        <a className="btn btn-gold bk-done-cta" href="/book">Book a new time</a>
      </div>
    );
  }

  if (!booking) {
    return <div className="bk-card"><p className="form-error bk-error">{error}</p></div>;
  }

  const cancelled = booking.status === 'cancelled';
  const past = new Date(booking.starts_at).getTime() < Date.now();

  // ── rescheduling ───────────────────────────────────────────────────────
  if (mode === 'reschedule' && type) {
    return (
      <div className="bk-card">
        <button type="button" className="bk-back" onClick={() => { setMode('view'); setSlot(null); setError(''); }}>
          <ArrowLeft size={15} /> Keep my current time
        </button>

        {error && <p className="form-error bk-error">{error}</p>}

        <SlotPicker
          typeSlug={type.slug}
          horizonDays={type.horizon_days}
          visitorTz={visitorTz}
          businessTz={businessTz}
          showTz={showTz}
          onShowTzChange={setShowTz}
          value={slot}
          onChange={setSlot}
          refreshKey={refreshKey}
          onError={setError}
        />

        {slot && (
          <button type="button" className="btn btn-gold bk-next" onClick={move} disabled={busy !== null}>
            {busy === 'move' ? <><Loader2 size={16} className="bk-spin" /> Moving…</> : 'Move my call here →'}
          </button>
        )}
      </div>
    );
  }

  // ── viewing ────────────────────────────────────────────────────────────
  return (
    <div className="bk-card">
      {flash && <p className="bk-flash"><Check size={15} /> {flash}</p>}
      {error && <p className="form-error bk-error">{error}</p>}

      <div className={`bk-chosen${cancelled ? ' is-off' : ''}`}>
        <CalendarDays size={17} />
        <div>
          <strong>{fmtLong(booking.starts_at)}</strong>
          <span>
            {booking.type.name} · {booking.type.duration_min} minutes · {showTz}
            {cancelled && ' · cancelled'}
          </span>
        </div>
      </div>

      <p className="bk-done-p">Booked for <strong>{booking.name}</strong> ({booking.email}).</p>

      {cancelled ? (
        <a className="btn btn-gold bk-done-cta" href="/book">Book a new time</a>
      ) : past ? (
        <p className="bk-note">This call has already taken place. <a href="/book">Book another</a> whenever you like.</p>
      ) : (
        <>
          {booking.meet_url && (
            <a className="btn btn-gold bk-done-cta" href={booking.meet_url} target="_blank" rel="noopener noreferrer">
              <Video size={16} /> Join the Google Meet
            </a>
          )}

          <div className="bk-manage-actions">
            <button type="button" className="bk-linkbtn" onClick={() => { setMode('reschedule'); setFlash(''); setError(''); }}>
              Move to another time
            </button>
            <button type="button" className="bk-linkbtn bk-linkbtn--danger" onClick={cancel} disabled={busy !== null}>
              {busy === 'cancel' ? 'Cancelling…' : <><X size={14} /> Cancel this call</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
