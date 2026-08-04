'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, CalendarX, Link2, Unlink, Activity, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

export interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  email?: string;
  calendar_id?: string;
  connected_at?: string;
  token_expires_at?: string;
  missing_scopes?: string[];
  message?: string;
}

type Flash = { kind: string; message: string } | null;
type TestResult = { ok: boolean; message: string; meet_url?: string } | null;

/**
 * Connect / verify / disconnect the Google account.
 *
 * The connect step is a full browser navigation, not a fetch: Google's consent
 * screen cannot be loaded in the background, and the redirect it issues has to
 * land on a real page. So the panel asks the server for a consent URL and then
 * hands the whole tab over.
 */
export default function GooglePanel({ initial, flash }: { initial: GoogleStatus | null; flash: Flash }) {
  const [status, setStatus] = useState<GoogleStatus | null>(initial);
  const [busy, setBusy] = useState<'connect' | 'disconnect' | 'test' | null>(null);
  const [error, setError] = useState('');
  const [test, setTest] = useState<TestResult>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/google', { cache: 'no-store' });
      if (!res.ok) return;
      setStatus((await res.json()) as GoogleStatus);
    } catch {
      /* leave the server-rendered status in place */
    }
  }, []);

  // Reconcile on mount — the page may have been restored from the router cache
  // after a disconnect in another tab, or arrived straight off the callback.
  useEffect(() => { void refresh(); }, [refresh]);

  async function connect() {
    setBusy('connect'); setError('');
    try {
      const res = await fetch('/api/admin/google/connect', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Could not start the Google sign-in.');
      // Hand the tab to Google. It comes back to /api/google/auth/callback.
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start the Google sign-in.');
      setBusy(null);
    }
  }

  async function disconnect() {
    if (!confirm('Disconnect Google? Existing bookings keep their Meet links, but no new calendar events can be created until you reconnect.')) return;
    setBusy('disconnect'); setError(''); setTest(null);
    try {
      const res = await fetch('/api/admin/google', { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not disconnect.');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not disconnect.');
    } finally {
      setBusy(null);
    }
  }

  async function runTest() {
    setBusy('test'); setError(''); setTest(null);
    try {
      const res = await fetch('/api/admin/google/test', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as TestResult;
      setTest(data ?? { ok: false, message: 'No response from the server.' });
    } catch {
      setTest({ ok: false, message: 'Could not reach the server.' });
    } finally {
      setBusy(null);
    }
  }

  const connected = !!status?.connected;
  const partial = !!status?.missing_scopes?.length;

  return (
    <div className="adm-mode">
      {flash && (
        <div className={`adm-mode-status adm-mode-status--${flash.kind === 'connected' ? 'live' : flash.kind === 'partial' ? 'soon' : 'warn'}`}>
          {flash.kind === 'connected' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <div>
            <strong>
              {flash.kind === 'connected' ? 'Connected' : flash.kind === 'partial' ? 'Connected with missing scopes' : 'Not connected'}
            </strong>
            <span>{flash.message}</span>
          </div>
        </div>
      )}

      {error && <p className="adm-form-error">{error}</p>}

      {/* ── Current state ─────────────────────────────────────────────── */}
      <div className={`adm-mode-status adm-mode-status--${!connected ? 'warn' : partial ? 'soon' : 'live'}`}>
        {connected ? <CalendarCheck size={18} /> : <CalendarX size={18} />}
        <div>
          <strong>
            {status?.configured === false
              ? 'Server credentials missing'
              : connected
                ? `Connected · ${status?.email ?? 'unknown account'}`
                : 'Not connected'}
          </strong>
          <span>{status?.message ?? 'Checking…'}</span>
        </div>
      </div>

      {connected && (
        <dl className="adm-kv">
          <div><dt>Account</dt><dd>{status?.email ?? '—'}</dd></div>
          <div><dt>Calendar</dt><dd>{status?.calendar_id ?? 'primary'}</dd></div>
          <div>
            <dt>Connected</dt>
            <dd>{status?.connected_at ? new Date(status.connected_at).toLocaleString() : '—'}</dd>
          </div>
          <div>
            <dt>Access token renews</dt>
            <dd>{status?.token_expires_at ? new Date(status.token_expires_at).toLocaleString() : '—'}</dd>
          </div>
        </dl>
      )}

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="adm-actions">
        <button type="button" className="adm-btn adm-btn--primary" onClick={connect} disabled={busy !== null}>
          <Link2 size={16} />
          {busy === 'connect' ? 'Opening Google…' : connected ? 'Reconnect' : 'Connect Google account'}
        </button>

        {connected && (
          <>
            <button type="button" className="adm-btn" onClick={runTest} disabled={busy !== null}>
              <Activity size={16} />
              {busy === 'test' ? 'Testing…' : 'Test connection'}
            </button>
            <button type="button" className="adm-btn adm-btn--danger" onClick={disconnect} disabled={busy !== null}>
              <Unlink size={16} />
              {busy === 'disconnect' ? 'Disconnecting…' : 'Disconnect'}
            </button>
          </>
        )}
      </div>

      {test && (
        <div className={`adm-mode-status adm-mode-status--${test.ok ? 'live' : 'warn'}`}>
          {test.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <div>
            <strong>{test.ok ? 'Everything works' : 'Test failed'}</strong>
            <span>{test.message}</span>
          </div>
        </div>
      )}

      {/* ── The two console switches this depends on ──────────────────── */}
      {!connected && (
        <div className="adm-note">
          <h3>Before connecting, two things must be true in the Google Console</h3>
          <ol>
            <li>
              <strong>The Google Calendar API is enabled</strong> on project <code>waheed-504415</code>
              {' '}(APIs &amp; Services → Library → Google Calendar API → Enable). Without it every call
              fails with a 403.
            </li>
            <li>
              <strong>The OAuth consent screen is published</strong> — not left in “Testing”. Refresh
              tokens issued by an External app in Testing expire after <strong>7 days</strong>, which
              would break booking every week. Publishing needs no review and changes nothing else.
              (If <code>admin.google.com</code> opens for this account it is Workspace, and setting the
              screen to “Internal” is better still.)
            </li>
          </ol>
          <p>
            These scopes must be listed on the consent screen:{' '}
            <code>calendar.events</code>, <code>calendar.readonly</code>, <code>openid</code>,{' '}
            <code>email</code>, <code>profile</code>.
          </p>
          <p>
            <a href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com" target="_blank" rel="noopener noreferrer">
              Open the Calendar API page <ExternalLink size={12} />
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
