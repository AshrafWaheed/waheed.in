'use client';

/**
 * The public booking flow.
 *
 * Three screens, not four: picking a date and picking a time are one decision
 * made in one place, because splitting them makes the visitor navigate
 * backwards every time a day turns out to be full.
 *
 *   pick  →  details  →  done
 *
 * ── Timezones ───────────────────────────────────────────────────────────────
 * The server returns UTC instants and says which zone the calendar was authored
 * in. ALL local rendering happens here, against the visitor's own detected
 * zone, because the browser is the only party that actually knows it. The zone
 * is named on screen and switchable — a booking page that silently shows the
 * wrong clock is worse than one showing no times at all.
 *
 * ── The 409 ─────────────────────────────────────────────────────────────────
 * If someone takes the slot while this visitor is typing, the times on screen
 * are a lie. That case does not get a generic error: it returns to the picker,
 * forces a refetch, and says plainly what happened.
 */

import { useState, useEffect, type FormEvent } from 'react';
import { Video, Check, Loader2, CalendarDays, ArrowLeft } from 'lucide-react';
import SlotPicker from './SlotPicker';

interface CallType {
  slug: string; name: string; description: string | null;
  duration_min: number; horizon_days: number; min_notice_min: number;
}
interface Booked {
  uid: string; starts_at: string; ends_at: string; meet_url: string | null;
  manage_token: string; name: string; email: string;
  type: { name: string; duration_min: number };
}

export default function BookingFlow() {
  const [visitorTz, setVisitorTz] = useState('UTC');
  const [businessTz, setBusinessTz] = useState('UTC');
  const [showTz, setShowTz] = useState('UTC');
  const [type, setType] = useState<CallType | null>(null);
  const [booting, setBooting] = useState(true);

  const [slot, setSlot] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stage, setStage] = useState<'pick' | 'details' | 'done'>('pick');

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState<Booked | null>(null);

  // Prefill from query params — the homepage clarity-call form sends the
  // visitor here with ?email=&company=&phone= after creating the HubSpot
  // contact, so the booking (which upserts the contact by email) attaches its
  // meeting to that SAME contact. Read from the URL directly to avoid a
  // useSearchParams Suspense boundary; runs once on mount.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const email = q.get('email') ?? '';
    const phone = q.get('phone') ?? '';
    const company = q.get('company') ?? '';
    if (email || phone || company) {
      setForm((f) => ({
        ...f,
        email: email || f.email,
        phone: phone || f.phone,
        company: company || f.company,
      }));
    }
  }, []);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setVisitorTz(tz); setShowTz(tz);

    (async () => {
      try {
        const res = await fetch('/api/booking/types', { cache: 'no-store' });
        const data = (await res.json()) as { timezone: string; types: CallType[] };
        setBusinessTz(data.timezone);
        setType(data.types[0] ?? null);
        if (!data.types?.length) setError('Bookings are closed at the moment. Please email info@waheed.in.');
      } catch {
        setError('Could not load the booking calendar. Please refresh, or email info@waheed.in.');
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const fmtLong = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', timeZone: showTz,
    }).format(new Date(iso));

  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: showTz })
      .format(new Date(iso));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!slot || !type) return;
    setSubmitting(true); setError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type.slug,
          starts_at: slot,
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company: form.company || null,
          message: form.message || null,
          visitor_tz: visitorTz,
          website: form.website, // honeypot — must stay empty
        }),
      });
      const data = (await res.json()) as { booking?: Booked; error?: string; code?: string };

      if (res.status === 409 || data.code === 'slot_taken') {
        setStage('pick');
        setSlot(null);
        setRefreshKey((k) => k + 1); // the visible list is stale — refetch it
        setError('Sorry — someone booked that time while you were typing. Here are the times still free.');
        return;
      }

      if (!res.ok || !data.booking) throw new Error(data.error ?? 'Could not book that time.');

      setBooked(data.booking);
      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not book that time.');
    } finally {
      setSubmitting(false);
    }
  }

  // ══ confirmed ═══════════════════════════════════════════════════════════
  if (stage === 'done' && booked) {
    return (
      <div className="bk-card bk-done">
        <span className="bk-done-icon"><Check size={26} /></span>
        <h2>You&apos;re booked.</h2>
        <p className="bk-done-when">{fmtLong(booked.starts_at)}</p>
        <p className="bk-done-tz">{booked.type.duration_min} minutes · times shown in {showTz}</p>

        {booked.meet_url ? (
          <a className="btn btn-gold bk-done-cta" href={booked.meet_url} target="_blank" rel="noopener noreferrer">
            <Video size={16} /> Join the Google Meet
          </a>
        ) : (
          <p className="bk-note">
            We&apos;ll email your meeting link shortly. If it hasn&apos;t arrived within the hour,
            reply to your confirmation and we&apos;ll sort it.
          </p>
        )}

        <p className="bk-done-p">
          A confirmation is on its way to <strong>{booked.email}</strong>, with a calendar invitation
          and a link to move or cancel the call if you need to.
        </p>

        <a className="bk-done-manage" href={`/book/manage/${booked.manage_token}`}>
          Change or cancel this booking
        </a>
      </div>
    );
  }

  // ══ details ═════════════════════════════════════════════════════════════
  if (stage === 'details' && slot) {
    return (
      <div className="bk-card">
        <button type="button" className="bk-back" onClick={() => { setStage('pick'); setError(''); }}>
          <ArrowLeft size={15} /> Pick another time
        </button>

        <div className="bk-chosen">
          <CalendarDays size={17} />
          <div>
            <strong>{fmtLong(slot)}</strong>
            <span>{type?.duration_min} minutes · {showTz}</span>
          </div>
        </div>

        {error && <p className="form-error bk-error">{error}</p>}

        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="bk-name">Your name *</label>
            <input id="bk-name" className="form-input" required minLength={2} maxLength={255}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bk-email">Email *</label>
            <input id="bk-email" type="email" className="form-input" required maxLength={255}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
          </div>

          <div className="bk-two">
            <div className="form-group">
              <label className="form-label" htmlFor="bk-company">Company</label>
              <input id="bk-company" className="form-input" maxLength={255}
                value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                autoComplete="organization" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bk-phone">Phone</label>
              <input id="bk-phone" type="tel" className="form-input" maxLength={30}
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bk-msg">What would you like to talk about?</label>
            <textarea id="bk-msg" className="form-input" rows={4} maxLength={2000}
              placeholder="A sentence is plenty — it just means we can prepare."
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          {/* Honeypot. Hidden from people, irresistible to bots. */}
          <div className="bk-hp" aria-hidden="true">
            <label htmlFor="bk-website">Website</label>
            <input id="bk-website" tabIndex={-1} autoComplete="off"
              value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-gold bk-submit" disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="bk-spin" /> Booking…</> : 'Confirm the call →'}
          </button>

          <p className="bk-fine">
            No payment, no obligation. We&apos;ll only use your details to run this call and follow up on it.
          </p>
        </form>
      </div>
    );
  }

  // ══ pick ════════════════════════════════════════════════════════════════
  return (
    <div className="bk-card">
      {error && <p className="form-error bk-error">{error}</p>}

      {booting && <p className="bk-times-empty"><Loader2 size={15} className="bk-spin" /> Loading the calendar…</p>}

      {type && (
        <>
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
            <button type="button" className="btn btn-gold bk-next"
              onClick={() => { setStage('details'); setError(''); }}>
              Continue with {fmtTime(slot)} →
            </button>
          )}
        </>
      )}
    </div>
  );
}
