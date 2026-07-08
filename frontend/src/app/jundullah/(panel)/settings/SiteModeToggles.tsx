'use client';

import { useState, useEffect } from 'react';
import { Rocket, Wrench, Globe, ExternalLink } from 'lucide-react';

type Flags = { coming_soon: boolean; maintenance: boolean };

export default function SiteModeToggles({
  initialComingSoon,
  initialMaintenance,
  initialLoaded,
}: {
  initialComingSoon: boolean;
  initialMaintenance: boolean;
  initialLoaded: boolean;
}) {
  const [comingSoon, setComingSoon] = useState(initialComingSoon);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [busy, setBusy] = useState<null | keyof Flags>(null);
  const [error, setError] = useState('');
  // Whether we're showing a real, freshly-confirmed state (vs. a possibly-stale
  // server render). Re-confirmed on mount so a cached navigation self-corrects.
  const [loaded, setLoaded] = useState(initialLoaded);

  // Always reconcile with the authoritative DB value when the page mounts.
  // This defeats any stale client-router/browser cache: the toggles can never
  // sit on an out-of-date value once the fresh fetch lands.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const data = (await res.json()) as Flags;
        if (!alive) return;
        setComingSoon(!!data.coming_soon);
        setMaintenance(!!data.maintenance);
        setLoaded(true);
        setError('');
      } catch {
        if (alive && !initialLoaded) setError('Could not load the current site mode — try refreshing.');
      }
    })();
    return () => { alive = false; };
  }, [initialLoaded]);

  async function toggle(key: keyof Flags, next: boolean) {
    setBusy(key); setError('');
    // optimistic
    if (key === 'coming_soon') setComingSoon(next); else setMaintenance(next);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: next }),
      });
      const data = (await res.json().catch(() => ({}))) as Flags;
      if (!res.ok) throw new Error('failed');
      // reconcile with the server's authoritative values
      setComingSoon(!!data.coming_soon);
      setMaintenance(!!data.maintenance);
    } catch {
      // revert
      if (key === 'coming_soon') setComingSoon(!next); else setMaintenance(!next);
      setError('Could not update — please try again.');
    } finally {
      setBusy(null);
    }
  }

  // Maintenance takes precedence over coming-soon, mirroring the proxy.
  const visitorState = !loaded
    ? { label: 'Checking…', tone: 'idle' as const, note: 'Reading the current site mode.' }
    : maintenance
      ? { label: 'Maintenance page', tone: 'warn' as const, note: 'Visitors see the maintenance screen.' }
      : comingSoon
        ? { label: 'Coming-soon page', tone: 'soon' as const, note: 'Visitors see the coming-soon screen.' }
        : { label: 'Live', tone: 'live' as const, note: 'The full site is public.' };

  return (
    <div className="adm-mode">
      {error && <p className="adm-form-error">{error}</p>}

      <div className={`adm-mode-status adm-mode-status--${visitorState.tone}`}>
        <Globe size={18} />
        <div>
          <strong>Right now: {visitorState.label}</strong>
          <span>{visitorState.note}</span>
        </div>
      </div>

      <div className="adm-mode-grid">
        <ToggleCard
          icon={<Rocket size={20} />}
          title="Coming soon"
          desc="Show a launch screen with an email sign-up. Use this before going live."
          on={comingSoon}
          busy={busy === 'coming_soon'}
          onChange={(v) => toggle('coming_soon', v)}
        />
        <ToggleCard
          icon={<Wrench size={20} />}
          title="Maintenance"
          desc="Show a “we’ll be right back” screen with an email box. Overrides coming-soon while on."
          on={maintenance}
          busy={busy === 'maintenance'}
          onChange={(v) => toggle('maintenance', v)}
        />
      </div>

      <p className="adm-mode-hint">
        Both off → the site is fully live. Preview any screen yourself:{' '}
        <a href="/coming-soon" target="_blank" rel="noopener noreferrer">coming-soon <ExternalLink size={12} /></a>{' · '}
        <a href="/maintenance" target="_blank" rel="noopener noreferrer">maintenance <ExternalLink size={12} /></a>
      </p>
    </div>
  );
}

function ToggleCard({
  icon, title, desc, on, busy, onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  on: boolean;
  busy: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={`adm-mode-card${on ? ' is-on' : ''}`}>
      <div className="adm-mode-card-head">
        <span className="adm-mode-icon">{icon}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={`Toggle ${title}`}
          className={`adm-switch${on ? ' on' : ''}`}
          disabled={busy}
          onClick={() => onChange(!on)}
        >
          <span className="adm-switch-knob" />
        </button>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className={`adm-mode-state${on ? ' on' : ''}`}>{busy ? 'Saving…' : on ? 'On' : 'Off'}</span>
    </div>
  );
}
