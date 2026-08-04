'use client';

/**
 * The month calendar + time column, shared by booking and rescheduling.
 *
 * Extracted rather than duplicated because the two flows must agree exactly on
 * what "available" means — a reschedule screen that offers a slot the booking
 * screen would refuse is a bug the user finds for you.
 *
 * Owns its own month, fetching and day selection. The parent only hears about
 * the chosen instant. `refreshKey` is how a parent forces a refetch after a 409
 * — the list on screen is stale at that moment and must not be trusted.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Local calendar date as Y-M-D — never toISOString(), which is UTC. */
export const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export interface SlotPickerProps {
  typeSlug: string;
  horizonDays: number;
  visitorTz: string;
  businessTz: string;
  showTz: string;
  onShowTzChange: (tz: string) => void;
  value: string | null;
  onChange: (iso: string) => void;
  /** Bump to force a refetch (e.g. after someone else took a slot). */
  refreshKey?: number;
  onError?: (message: string) => void;
}

export default function SlotPicker({
  typeSlug, horizonDays, visitorTz, businessTz, showTz, onShowTzChange,
  value, onChange, refreshKey = 0, onError,
}: SlotPickerProps) {
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (m: Date) => {
    setLoading(true);
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const last = new Date(m.getFullYear(), m.getMonth() + 1, 0);
    const now = new Date();

    try {
      const qs = new URLSearchParams({
        type: typeSlug,
        from: ymd(first < now ? now : first),
        to: ymd(last),
      });
      const res = await fetch(`/api/booking/slots?${qs}`, { cache: 'no-store' });
      const data = (await res.json()) as { days?: { date: string; slots: string[] }[] };
      const map: Record<string, string[]> = {};
      for (const d of data.days ?? []) map[d.date] = d.slots;
      setSlots(map);
    } catch {
      onError?.('Could not load available times. Please refresh.');
    } finally {
      setLoading(false);
    }
    // onError is a stable-enough callback in both call sites; excluded so a
    // parent re-render cannot retrigger a month fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSlug]);

  useEffect(() => { void load(month); }, [month, refreshKey, load]);

  const grid = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // JS 0=Sun; the grid is Monday-first
    const cells: (string | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= daysIn; d++) {
      cells.push(ymd(new Date(month.getFullYear(), month.getMonth(), d)));
    }
    return cells;
  }, [month]);

  const fmtTime = useCallback(
    (iso: string) => new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: showTz,
    }).format(new Date(iso)),
    [showTz],
  );

  const today = ymd(new Date());
  const monthIndex = month.getFullYear() * 12 + month.getMonth();
  const nowIndex = (() => { const n = new Date(); return n.getFullYear() * 12 + n.getMonth(); })();
  const maxIndex = (() => {
    const d = new Date(); d.setDate(d.getDate() + horizonDays);
    return d.getFullYear() * 12 + d.getMonth();
  })();

  const daySlots = date ? slots[date] ?? [] : [];

  return (
    <div className="bk-pick">
      <div className="bk-cal">
        <div className="bk-cal-head">
          <button type="button" aria-label="Previous month" disabled={monthIndex <= nowIndex}
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            <ChevronLeft size={17} />
          </button>
          <strong>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(month)}</strong>
          <button type="button" aria-label="Next month" disabled={monthIndex >= maxIndex}
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="bk-cal-week">{WEEK.map((d) => <span key={d}>{d}</span>)}</div>

        <div className="bk-cal-grid">
          {grid.map((cell, i) => {
            if (!cell) return <span key={`pad${i}`} />;
            const count = slots[cell]?.length ?? 0;
            const num = Number(cell.slice(-2));
            return (
              <button
                key={cell} type="button" disabled={count === 0}
                className={`bk-day${date === cell ? ' is-on' : ''}${cell === today ? ' is-today' : ''}`}
                onClick={() => setDate(cell)}
                aria-label={`${num}${count ? `, ${count} times available` : ', unavailable'}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="bk-cal-loading"><Loader2 size={14} className="bk-spin" /> Checking the calendar…</p>
        )}
      </div>

      <div className="bk-times">
        {!date && (
          <p className="bk-times-empty">
            {loading ? 'Loading available days…' : 'Pick a day to see the times.'}
          </p>
        )}

        {date && (
          <>
            <div className="bk-times-head">
              <strong>
                {new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                  .format(new Date(`${date}T12:00:00`))}
              </strong>
              <label className="bk-tzpick">
                <span>Times in</span>
                <select value={showTz} onChange={(e) => onShowTzChange(e.target.value)}
                  aria-label="Show times in timezone">
                  <option value={visitorTz}>{visitorTz} (yours)</option>
                  {businessTz !== visitorTz && <option value={businessTz}>{businessTz} (ours)</option>}
                </select>
              </label>
            </div>

            <div className="bk-slots">
              {daySlots.map((s) => (
                <button key={s} type="button"
                  className={`bk-slot${value === s ? ' is-on' : ''}`}
                  onClick={() => onChange(s)}>
                  {fmtTime(s)}
                </button>
              ))}
              {daySlots.length === 0 && <p className="bk-times-empty">Nothing free that day.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
