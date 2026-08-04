'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, Save, CalendarOff, Clock, Eye, RefreshCw } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface Rule { id?: number; weekday: number; start_time: string; end_time: string }
export interface Override {
  id: number; date: string; is_closed: boolean;
  start_time: string | null; end_time: string | null; note: string | null;
}
export interface CallType {
  id: number; slug: string; name: string; description: string | null;
  duration_min: number; buffer_before: number; buffer_after: number;
  min_notice_min: number; horizon_days: number; daily_cap: number | null; is_active: boolean;
}
export interface AvailabilityPayload {
  timezone: string;
  use_freebusy: boolean;
  timezones: string[];
  rules: Rule[];
  overrides: Override[];
  type: CallType;
}

/** MySQL hands back "10:00:00"; <input type="time"> wants "10:00". */
const hhmm = (t: string | null) => (t ?? '').slice(0, 5);

/**
 * The availability screen.
 *
 * Every write returns the FULL refreshed payload, so this component never has
 * to re-fetch or reconcile — it just swaps state for whatever the server says
 * is now true. That keeps the weekly grid (which saves wholesale) and the
 * overrides (which save one at a time) from ever drifting apart on screen.
 */
export default function AvailabilityEditor({ initial }: { initial: AvailabilityPayload }) {
  const [data, setData] = useState(initial);
  const [rules, setRules] = useState<Rule[]>(
    initial.rules.map((r) => ({ ...r, start_time: hhmm(r.start_time), end_time: hhmm(r.end_time) })),
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [preview, setPreview] = useState<{ date: string; count: number; times: string[] }[] | null>(null);

  /** One writer for every save on this screen. */
  const send = useCallback(async (
    key: string, url: string, method: string, body?: unknown,
  ): Promise<AvailabilityPayload | null> => {
    setBusy(key); setError(''); setSaved('');
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errs = (json as { errors?: Record<string, string[]>; message?: string });
        throw new Error(
          errs.errors ? Object.values(errs.errors)[0]?.[0] ?? 'Save failed.' : errs.message ?? 'Save failed.',
        );
      }
      const payload = json as AvailabilityPayload;
      setData(payload);
      setRules(payload.rules.map((r) => ({ ...r, start_time: hhmm(r.start_time), end_time: hhmm(r.end_time) })));
      setSaved(key);
      setPreview(null); // the rules changed, so any preview on screen is stale
      return payload;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.');
      return null;
    } finally {
      setBusy(null);
    }
  }, []);

  // ── weekly grid ─────────────────────────────────────────────────────────
  const addWindow = (weekday: number) =>
    setRules((r) => [...r, { weekday, start_time: '10:00', end_time: '13:00' }]);

  const removeWindow = (index: number) =>
    setRules((r) => r.filter((_, i) => i !== index));

  const editWindow = (index: number, field: 'start_time' | 'end_time', value: string) =>
    setRules((r) => r.map((rule, i) => (i === index ? { ...rule, [field]: value } : rule)));

  const saveWeek = () =>
    send('week', '/api/admin/booking/availability', 'PUT', {
      rules: rules.map(({ weekday, start_time, end_time }) => ({ weekday, start_time, end_time })),
    });

  // ── overrides ───────────────────────────────────────────────────────────
  const [ovDate, setOvDate] = useState('');
  const [ovClosed, setOvClosed] = useState(true);
  const [ovStart, setOvStart] = useState('10:00');
  const [ovEnd, setOvEnd] = useState('13:00');
  const [ovNote, setOvNote] = useState('');

  async function addOverride() {
    if (!ovDate) { setError('Pick a date first.'); return; }
    const ok = await send('override', '/api/admin/booking/overrides', 'POST', {
      date: ovDate,
      is_closed: ovClosed,
      start_time: ovClosed ? null : ovStart,
      end_time: ovClosed ? null : ovEnd,
      note: ovNote || null,
    });
    if (ok) { setOvDate(''); setOvNote(''); }
  }

  async function loadPreview() {
    setBusy('preview'); setError('');
    try {
      const res = await fetch('/api/admin/booking/preview', { cache: 'no-store' });
      const json = (await res.json()) as { days: { date: string; count: number; times: string[] }[] };
      setPreview(json.days ?? []);
    } catch {
      setError('Could not load the preview.');
    } finally {
      setBusy(null);
    }
  }

  const t = data.type;

  return (
    <div className="adm-mode">
      {error && <p className="adm-form-error">{error}</p>}

      {/* ── Weekly hours ──────────────────────────────────────────────── */}
      <section className="bka-sec">
        <h2 className="bka-h2"><Clock size={16} /> Weekly hours</h2>
        <p className="bka-help">
          Wall-clock times in {data.timezone}. A day with no windows is not bookable. Split a day by
          adding a second window.
        </p>

        <div className="bka-week">
          {DAYS.map((label, weekday) => {
            const rows = rules.map((r, i) => ({ ...r, i })).filter((r) => r.weekday === weekday);
            return (
              <div key={weekday} className={`bka-day${rows.length ? '' : ' is-off'}`}>
                <span className="bka-dayname">{label}</span>
                <div className="bka-windows">
                  {rows.length === 0 && <span className="bka-closed">Unavailable</span>}
                  {rows.map((r) => (
                    <div className="bka-window" key={r.i}>
                      <input type="time" value={r.start_time} onChange={(e) => editWindow(r.i, 'start_time', e.target.value)} />
                      <span>→</span>
                      <input type="time" value={r.end_time} onChange={(e) => editWindow(r.i, 'end_time', e.target.value)} />
                      <button type="button" onClick={() => removeWindow(r.i)} aria-label="Remove window" className="bka-x">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="bka-add" onClick={() => addWindow(weekday)}>
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn--primary" onClick={saveWeek} disabled={busy !== null}>
            <Save size={16} /> {busy === 'week' ? 'Saving…' : 'Save weekly hours'}
          </button>
          {saved === 'week' && <span className="bka-saved">Saved.</span>}
        </div>
      </section>

      {/* ── Exceptions ────────────────────────────────────────────────── */}
      <section className="bka-sec">
        <h2 className="bka-h2"><CalendarOff size={16} /> Date exceptions</h2>
        <p className="bka-help">
          Close a specific day, or give it different hours. A closed day always wins over the weekly
          grid.
        </p>

        {data.overrides.length > 0 && (
          <ul className="bka-ovlist">
            {data.overrides.map((o) => (
              <li key={o.id}>
                <strong>{o.date}</strong>
                <span className={o.is_closed ? 'bka-tag bka-tag--closed' : 'bka-tag'}>
                  {o.is_closed ? 'Closed' : `${hhmm(o.start_time)} → ${hhmm(o.end_time)}`}
                </span>
                {o.note && <em>{o.note}</em>}
                <button
                  type="button"
                  className="bka-x"
                  aria-label={`Remove exception for ${o.date}`}
                  disabled={busy !== null}
                  onClick={() => send('override', `/api/admin/booking/overrides/${o.id}`, 'DELETE')}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="bka-ovform">
          <input type="date" value={ovDate} onChange={(e) => setOvDate(e.target.value)} aria-label="Exception date" />
          <select value={ovClosed ? 'closed' : 'custom'} onChange={(e) => setOvClosed(e.target.value === 'closed')}>
            <option value="closed">Closed all day</option>
            <option value="custom">Custom hours</option>
          </select>
          {!ovClosed && (
            <>
              <input type="time" value={ovStart} onChange={(e) => setOvStart(e.target.value)} aria-label="Start" />
              <input type="time" value={ovEnd} onChange={(e) => setOvEnd(e.target.value)} aria-label="End" />
            </>
          )}
          <input
            type="text" placeholder="Note (optional)" value={ovNote}
            onChange={(e) => setOvNote(e.target.value)} maxLength={255} aria-label="Note"
          />
          <button type="button" className="adm-btn" onClick={addOverride} disabled={busy !== null}>
            <Plus size={15} /> {busy === 'override' ? 'Saving…' : 'Add'}
          </button>
        </div>
      </section>

      {/* ── Call settings ─────────────────────────────────────────────── */}
      <section className="bka-sec">
        <h2 className="bka-h2"><Clock size={16} /> The call</h2>
        <div className="bka-grid">
          <Field label="Length" hint="minutes">
            <input type="number" min={5} max={480} defaultValue={t.duration_min}
              onBlur={(e) => send('type', `/api/admin/booking/types/${t.id}`, 'PATCH', { duration_min: +e.target.value })} />
          </Field>
          <Field label="Gap after" hint="minutes of breathing room">
            <input type="number" min={0} max={240} defaultValue={t.buffer_after}
              onBlur={(e) => send('type', `/api/admin/booking/types/${t.id}`, 'PATCH', { buffer_after: +e.target.value })} />
          </Field>
          <Field label="Minimum notice" hint="minutes before the earliest slot">
            <input type="number" min={0} max={20160} defaultValue={t.min_notice_min}
              onBlur={(e) => send('type', `/api/admin/booking/types/${t.id}`, 'PATCH', { min_notice_min: +e.target.value })} />
          </Field>
          <Field label="Book ahead" hint="days">
            <input type="number" min={1} max={365} defaultValue={t.horizon_days}
              onBlur={(e) => send('type', `/api/admin/booking/types/${t.id}`, 'PATCH', { horizon_days: +e.target.value })} />
          </Field>
          <Field label="Max per day" hint="blank = no limit">
            <input type="number" min={1} max={50} defaultValue={t.daily_cap ?? ''}
              onBlur={(e) => send('type', `/api/admin/booking/types/${t.id}`, 'PATCH', { daily_cap: e.target.value === '' ? null : +e.target.value })} />
          </Field>
          <Field label="Timezone" hint="your working hours are in this zone">
            <select defaultValue={data.timezone}
              onChange={(e) => send('tz', '/api/admin/booking/settings', 'PATCH', { timezone: e.target.value })}>
              {data.timezones.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </Field>
        </div>

        <label className="bka-check">
          <input
            type="checkbox" defaultChecked={data.use_freebusy}
            onChange={(e) => send('fb', '/api/admin/booking/settings', 'PATCH', { use_freebusy: e.target.checked })}
          />
          <span>
            Also block times that are busy on my Google Calendar
            <small>Off means only bookings made here block a slot — your own meetings would not.</small>
          </span>
        </label>
      </section>

      {/* ── Preview ───────────────────────────────────────────────────── */}
      <section className="bka-sec">
        <h2 className="bka-h2"><Eye size={16} /> What visitors will see</h2>
        <p className="bka-help">
          The next two weeks, after buffers, notice, daily caps and your real calendar are all applied.
        </p>
        <div className="adm-actions">
          <button type="button" className="adm-btn" onClick={loadPreview} disabled={busy !== null}>
            <RefreshCw size={15} /> {busy === 'preview' ? 'Checking…' : 'Show me'}
          </button>
        </div>
        {preview && (
          preview.length === 0
            ? <p className="adm-form-error">No bookable time at all in the next two weeks — check the weekly hours above.</p>
            : (
              <ul className="bka-preview">
                {preview.map((d) => (
                  <li key={d.date}>
                    <strong>{d.date}</strong>
                    <span>{d.count} slot{d.count === 1 ? '' : 's'}</span>
                    <em>{d.times.join('  ·  ')}</em>
                  </li>
                ))}
              </ul>
            )
        )}
      </section>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="bka-field">
      <span className="bka-field-label">{label}</span>
      {children}
      <small>{hint}</small>
    </label>
  );
}
