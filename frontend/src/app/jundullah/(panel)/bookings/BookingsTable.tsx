'use client';

import { useState, useCallback } from 'react';
import {
  Video, X, RefreshCw, AlertTriangle, Search, ExternalLink,
  CalendarClock, Check, UserX, StickyNote,
} from 'lucide-react';

export interface BookingRow {
  id: number; uid: string; name: string; email: string; company: string | null;
  starts_at: string; ends_at: string; visitor_tz: string;
  status: string; calendar_status: string | null; meet_url: string | null;
  type: string | null; duration_min: number | null; created_at: string;
}
export interface BookingDetail extends BookingRow {
  message: string | null; phone: string | null; admin_note: string | null;
  google_html_link: string | null; source: string; hubspot_status: string | null;
  manage_url: string;
}
export interface TimelineEvent { kind: string; meta: Record<string, unknown> | null; at: string }
export interface BookingsPayload {
  timezone: string;
  counts: { upcoming: number; past: number; cancelled: number };
  data: BookingRow[];
  meta: { current_page: number; last_page: number; total: number };
}

const SCOPES = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
] as const;

/** Plain English for the audit trail — the raw kinds are for the database. */
const EVENT_LABEL: Record<string, string> = {
  created: 'Booked',
  rescheduled: 'Moved to a new time',
  cancelled: 'Cancelled',
  completed: 'Marked as held',
  no_show: 'Marked as a no-show',
  mail_sent: 'Confirmation emailed',
  mail_failed: 'Email failed to send',
  reminder_sent: 'Reminder emailed',
  calendar_synced: 'Added to Google Calendar',
  calendar_failed: 'Google Calendar failed',
  hubspot_synced: 'Synced to HubSpot',
  hubspot_failed: 'HubSpot sync failed',
};
const BAD_EVENTS = new Set(['mail_failed', 'calendar_failed', 'hubspot_failed', 'cancelled', 'no_show']);

/**
 * The booked-calls list, with a detail drawer showing each booking's full
 * history.
 *
 * Times are rendered in the BUSINESS timezone, with the visitor's own zone
 * shown alongside when it differs — an admin scanning tomorrow's calls needs
 * their own clock, but needs to know when they are asking someone to take a
 * call at 3am.
 */
export default function BookingsTable({ initial }: { initial: BookingsPayload }) {
  const [payload, setPayload] = useState(initial);
  const [scope, setScope] = useState<string>('upcoming');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<{ booking: BookingDetail; events: TimelineEvent[] } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const tz = payload.timezone;

  const fmt = useCallback((iso: string, zone = tz) =>
    new Intl.DateTimeFormat('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', timeZone: zone,
    }).format(new Date(iso)), [tz]);

  const load = useCallback(async (nextScope: string, search: string, page = 1) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ scope: nextScope, page: String(page) });
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/bookings?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load bookings.');
      setPayload(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function openDetail(id: number) {
    setBusy(`open-${id}`); setError('');
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load that booking.');
      setOpen(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load that booking.');
    } finally {
      setBusy(null);
    }
  }

  async function act(id: number, path: string, method = 'POST', body?: unknown) {
    setBusy(path); setError('');
    try {
      const res = await fetch(`/api/admin/bookings/${id}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as { error?: string }).error ?? 'That did not work.');
      setOpen(json);
      await load(scope, q, payload.meta.current_page);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That did not work.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {error && <p className="adm-form-error">{error}</p>}

      <div className="bkl-bar">
        <div className="bkl-tabs">
          {SCOPES.map((s) => (
            <button
              key={s.key} type="button"
              className={`bkl-tab${scope === s.key ? ' is-on' : ''}`}
              onClick={() => { setScope(s.key); void load(s.key, q); }}
            >
              {s.label}
              <span>{payload.counts[s.key]}</span>
            </button>
          ))}
        </div>

        <form
          className="bkl-search"
          onSubmit={(e) => { e.preventDefault(); void load(scope, q); }}
        >
          <Search size={15} />
          <input
            type="search" placeholder="Name, email or company" value={q}
            onChange={(e) => setQ(e.target.value)} aria-label="Search bookings"
          />
        </form>
      </div>

      {loading && <p className="bkl-empty">Loading…</p>}

      {!loading && payload.data.length === 0 && (
        <p className="bkl-empty">
          {scope === 'upcoming' ? 'No upcoming calls.' : scope === 'past' ? 'No past calls yet.' : 'Nothing cancelled.'}
        </p>
      )}

      {!loading && payload.data.length > 0 && (
        <div className="bkl-list">
          {payload.data.map((b) => {
            const differentZone = b.visitor_tz && b.visitor_tz !== tz;
            return (
              <button
                key={b.id} type="button" className="bkl-row"
                onClick={() => openDetail(b.id)} disabled={busy === `open-${b.id}`}
              >
                <span className="bkl-when">
                  <strong>{fmt(b.starts_at)}</strong>
                  {differentZone && <small>{fmt(b.starts_at, b.visitor_tz)} their time</small>}
                </span>
                <span className="bkl-who">
                  <strong>{b.name}</strong>
                  <small>{b.company ? `${b.company} · ` : ''}{b.email}</small>
                </span>
                <span className="bkl-tags">
                  {b.status !== 'confirmed' && (
                    <em className={`bkl-tag bkl-tag--${b.status}`}>{b.status.replace('_', ' ')}</em>
                  )}
                  {b.calendar_status === 'failed' && (
                    <em className="bkl-tag bkl-tag--warn"><AlertTriangle size={11} /> not on calendar</em>
                  )}
                  {b.meet_url && <em className="bkl-tag bkl-tag--meet"><Video size={11} /> Meet</em>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {payload.meta.last_page > 1 && (
        <div className="adm-actions" style={{ marginTop: '1rem' }}>
          <button
            type="button" className="adm-btn" disabled={payload.meta.current_page <= 1}
            onClick={() => load(scope, q, payload.meta.current_page - 1)}
          >← Newer</button>
          <span style={{ alignSelf: 'center', fontSize: '.8rem', color: '#6b7c80' }}>
            {payload.meta.current_page} / {payload.meta.last_page}
          </span>
          <button
            type="button" className="adm-btn" disabled={payload.meta.current_page >= payload.meta.last_page}
            onClick={() => load(scope, q, payload.meta.current_page + 1)}
          >Older →</button>
        </div>
      )}

      {/* ── Detail drawer ─────────────────────────────────────────────── */}
      {open && (
        <div className="bkl-drawer-wrap" role="dialog" aria-modal="true" aria-label="Booking detail">
          <div className="bkl-backdrop" onClick={() => setOpen(null)} />
          <aside className="bkl-drawer">
            <header>
              <div>
                <h2>{open.booking.name}</h2>
                <p>{open.booking.type} · {open.booking.duration_min} min</p>
              </div>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close"><X size={18} /></button>
            </header>

            <dl className="adm-kv">
              <div><dt>When</dt><dd>{fmt(open.booking.starts_at)}<br /><small>{tz}</small></dd></div>
              {open.booking.visitor_tz !== tz && (
                <div><dt>Their time</dt><dd>{fmt(open.booking.starts_at, open.booking.visitor_tz)}<br /><small>{open.booking.visitor_tz}</small></dd></div>
              )}
              <div><dt>Email</dt><dd><a href={`mailto:${open.booking.email}`}>{open.booking.email}</a></dd></div>
              {open.booking.phone && <div><dt>Phone</dt><dd>{open.booking.phone}</dd></div>}
              {open.booking.company && <div><dt>Company</dt><dd>{open.booking.company}</dd></div>}
              <div><dt>Reference</dt><dd><code>{open.booking.uid}</code></dd></div>
            </dl>

            {open.booking.message && (
              <div className="bkl-msg">
                <h3>What they want to talk about</h3>
                <p>{open.booking.message}</p>
              </div>
            )}

            <div className="adm-actions">
              {open.booking.meet_url && (
                <a className="adm-btn adm-btn--primary" href={open.booking.meet_url} target="_blank" rel="noopener noreferrer">
                  <Video size={15} /> Join Meet
                </a>
              )}
              {open.booking.google_html_link && (
                <a className="adm-btn" href={open.booking.google_html_link} target="_blank" rel="noopener noreferrer">
                  <CalendarClock size={15} /> In Calendar <ExternalLink size={12} />
                </a>
              )}
              {open.booking.calendar_status === 'failed' && open.booking.status === 'confirmed' && (
                <button type="button" className="adm-btn" disabled={busy !== null}
                  onClick={() => act(open.booking.id, '/resync')}>
                  <RefreshCw size={15} /> {busy === '/resync' ? 'Retrying…' : 'Retry calendar'}
                </button>
              )}
            </div>

            {open.booking.status === 'confirmed' && (
              <div className="adm-actions">
                <button type="button" className="adm-btn" disabled={busy !== null}
                  onClick={() => act(open.booking.id, '', 'PATCH', { status: 'completed' })}>
                  <Check size={15} /> Held
                </button>
                <button type="button" className="adm-btn" disabled={busy !== null}
                  onClick={() => act(open.booking.id, '', 'PATCH', { status: 'no_show' })}>
                  <UserX size={15} /> No-show
                </button>
                <button type="button" className="adm-btn adm-btn--danger" disabled={busy !== null}
                  onClick={() => { if (confirm('Cancel this call? The Google event is deleted and the slot reopens.')) act(open.booking.id, '/cancel'); }}>
                  <X size={15} /> Cancel call
                </button>
              </div>
            )}

            <div className="bkl-note">
              <h3><StickyNote size={14} /> Private note</h3>
              <textarea
                defaultValue={open.booking.admin_note ?? ''} rows={3} maxLength={2000}
                placeholder="Only you see this."
                onBlur={(e) => {
                  if (e.target.value !== (open.booking.admin_note ?? '')) {
                    void act(open.booking.id, '', 'PATCH', { admin_note: e.target.value || null });
                  }
                }}
              />
            </div>

            <div className="bkl-timeline">
              <h3>History</h3>
              <ol>
                {open.events.map((e, i) => (
                  <li key={i} className={BAD_EVENTS.has(e.kind) ? 'is-bad' : ''}>
                    <span className="bkl-dot" />
                    <div>
                      <strong>{EVENT_LABEL[e.kind] ?? e.kind}</strong>
                      <time>{fmt(e.at)}</time>
                      {typeof e.meta?.message === 'string' && <em>{e.meta.message}</em>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
