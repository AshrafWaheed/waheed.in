'use client';

import { useState } from 'react';
import {
  Check, Copy, RefreshCw, Trash2, AlertTriangle, Share2, RotateCcw, Send, ExternalLink, Link2,
} from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import { runContentJob } from '@/lib/content-job';
import IndexationGate from './IndexationGate';
import { hostOf } from '@/lib/url';
import type { VariantPayload, Variant } from './page';

/**
 * Platform variants (documents/CONTENT_ENGINE.md §6 stages 6–7).
 *
 * Each variant is a different piece arguing from the same research, not the
 * article reformatted. The `angle` line is shown first on every card for
 * exactly that reason: it is the one field that makes "these are genuinely
 * different" checkable in a glance instead of a claim in a design doc.
 *
 * Publishing splits by what each platform actually allows. Blogger has a real
 * API and gets a Publish button. Medium closed new integration tokens in 2023,
 * Substack has never shipped a publishing API, and LinkedIn article posting is
 * not in the public API — those get Copy plus a field to paste back where it
 * went, which is a first-class path rather than a fallback, because it is how
 * most of the set will always work.
 *
 * Nothing publishes anywhere until the indexation gate above is open (P4).
 */

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  draft: { bg: '#F6ECD3', fg: '#9c6f1c' },
  approved: { bg: '#E5EFE6', fg: '#3C7A5B' },
  queued: { bg: '#E4EAF0', fg: '#41607a' },
  published: { bg: '#E5EFE6', fg: '#3C7A5B' },
  failed: { bg: '#F4E2D8', fg: '#a1502f' },
};

export default function VariantPanel({
  initial,
  postId,
  postSlug,
}: {
  initial: VariantPayload;
  postId: number;
  postSlug: string;
}) {
  const [data, setData] = useState<VariantPayload>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [urlFor, setUrlFor] = useState<number | null>(null);
  const [externalUrl, setExternalUrl] = useState('');

  async function call(key: string, url: string, method: string, body?: unknown) {
    setBusy(key);
    setError(null);
    setElapsed(0);
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      setData(json as VariantPayload);
    } catch {
      setError('Network error. Nothing was saved.');
    } finally {
      clearInterval(tick);
      setBusy(null);
    }
  }

  /**
   * Generation is queued, not synchronous: it runs for minutes and the request
   * path gives up at sixty seconds. Fire it, then poll until it lands and
   * refetch the panel.
   */
  async function generate(platform: string) {
    setBusy(`gen:${platform}`);
    setError(null);
    setElapsed(0);
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    try {
      await runContentJob(`/api/admin/content/drafts/${postId}/variants`, { platform });
      const res = await fetch(`/api/admin/content/drafts/${postId}/variants`);
      if (res.ok) setData((await res.json()) as VariantPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      clearInterval(tick);
      setBusy(null);
    }
  }

  /** Clipboard needs a secure context; the admin is HTTPS, but fail visibly. */
  async function copy(v: Variant) {
    try {
      await navigator.clipboard.writeText(`${v.title}\n\n${plain(v)}`);
      setCopied(v.id);
      setTimeout(() => setCopied((c) => (c === v.id ? null : c)), 2000);
    } catch {
      setError('Could not reach the clipboard. Select the text and copy it manually.');
    }
  }

  const plain = (v: Variant) =>
    v.format === 'text'
      ? v.body_html
      : v.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  return (
    <section
      style={{
        border: '1px solid var(--line, #E4DACA)',
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 22,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h2 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Share2 size={15} /> Platform versions
        </h2>
        <span style={{ fontSize: '.78em', opacity: 0.65 }}>
          {data.variants.length} written · {data.available.length} not yet
        </span>
      </div>

      <p style={{ fontSize: '.85em', opacity: 0.72, margin: '6px 0 12px', lineHeight: 1.55 }}>
        Each one is a different piece arguing from the same research, not this article reposted.
        Reposting would put near-duplicates on five domains competing with the original.
      </p>

      <IndexationGate
        initial={data.indexation}
        postId={postId}
        postSlug={postSlug}
        onChange={(next) => next && setData(next)}
      />

      {!data.can_generate && (
        <div
          style={{
            border: '1px solid #E4CE7A',
            borderLeft: '3px solid #9c7d1c',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 12,
            fontSize: '.88em',
          }}
        >
          {data.blocked_reason}
        </div>
      )}

      {error && (
        <p style={{ color: '#a1502f', fontSize: '.85em', marginBottom: 10 }} role="alert">
          {error}
        </p>
      )}

      {/* Generate buttons for platforms with no variant yet. */}
      {data.can_generate && data.available.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {data.available.map((p) => (
            <StackButton
              key={p.key}
              size="sm"
              tone="ghost"
              disabled={busy !== null}
              onClick={() => generate(p.key)}
            >
              {busy === `gen:${p.key}`
                ? `Writing… ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
                : `Write for ${p.label}`}
            </StackButton>
          ))}
        </div>
      )}

      {busy?.startsWith('gen:') && (
        <p style={{ fontSize: '.8em', opacity: 0.65, marginBottom: 12 }}>
          Running on the queue, so this survives you closing the tab. It forks the session the
          article was researched in and keeps the sources rather than looking them up again.
          Usually one to three minutes.
        </p>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {data.variants.map((v) => {
          const st = STATUS_STYLE[v.status] ?? STATUS_STYLE.draft;
          const over = v.max_chars !== null && v.char_count > v.max_chars;
          const working = busy === `v:${v.id}`;
          return (
            <article
              key={v.id}
              style={{
                border: '1px solid var(--line, #E4DACA)',
                borderLeft: v.is_stale ? '3px solid #a1502f' : '1px solid var(--line, #E4DACA)',
                borderRadius: 10,
                padding: '13px 15px',
                opacity: working ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                <strong style={{ fontSize: '.95em' }}>{v.label}</strong>
                <span
                  style={{
                    background: st.bg, color: st.fg, fontSize: '.66rem', letterSpacing: '.04em',
                    textTransform: 'uppercase', padding: '.2em .55em', borderRadius: 999,
                  }}
                >
                  {v.status}
                </span>
                <span
                  style={{
                    fontSize: '.76em',
                    fontVariantNumeric: 'tabular-nums',
                    color: over ? '#a1502f' : undefined,
                    opacity: over ? 1 : 0.6,
                  }}
                >
                  {v.char_count.toLocaleString()}
                  {v.max_chars ? ` / ${v.max_chars.toLocaleString()}` : ''} chars
                </span>
                {v.publish === 'manual' && (
                  <span style={{ fontSize: '.72em', opacity: 0.55 }} title="No usable publishing API — copy and paste">
                    copy-paste
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 6px', fontWeight: 500 }}>{v.title}</p>

              {/* The angle first: it is what makes the variants checkably different. */}
              <p style={{ margin: '0 0 8px', fontSize: '.86em', opacity: 0.75, lineHeight: 1.5 }}>
                <em>{v.angle}</em>
              </p>

              {v.warnings.length > 0 && (
                <ul
                  style={{
                    margin: '0 0 8px', paddingLeft: '1.1rem',
                    fontSize: '.83em', color: '#9c6f1c',
                  }}
                >
                  {v.warnings.map((w) => (
                    <li key={w} style={{ marginBottom: 2 }}>
                      <AlertTriangle size={11} style={{ verticalAlign: '-1px' }} /> {w}
                    </li>
                  ))}
                </ul>
              )}

              {openId === v.id && (
                <pre
                  style={{
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    background: 'rgba(0,0,0,.03)', borderRadius: 8, padding: '10px 12px',
                    fontSize: '.84em', lineHeight: 1.6, margin: '0 0 10px',
                    fontFamily: 'inherit', maxHeight: 420, overflowY: 'auto',
                  }}
                >
                  {plain(v)}
                </pre>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <StackButton size="sm" tone="ghost" onClick={() => setOpenId(openId === v.id ? null : v.id)}>
                  {openId === v.id ? 'Hide' : 'Read'}
                </StackButton>
                <StackButton size="sm" tone="ghost" onClick={() => copy(v)}>
                  <Copy size={13} /> {copied === v.id ? 'Copied' : 'Copy'}
                </StackButton>
                {v.status === 'approved' ? (
                  <StackButton
                    size="sm"
                    tone="ghost"
                    disabled={working}
                    onClick={() => call(`v:${v.id}`, `/api/admin/content/variants/${v.id}/approve`, 'DELETE')}
                  >
                    <RotateCcw size={13} /> Unapprove
                  </StackButton>
                ) : (
                  <StackButton
                    size="sm"
                    disabled={working || v.is_stale}
                    title={v.is_stale ? 'The article changed since this was written' : undefined}
                    onClick={() => call(`v:${v.id}`, `/api/admin/content/variants/${v.id}/approve`, 'POST')}
                  >
                    <Check size={13} /> Approve
                  </StackButton>
                )}
                <StackButton
                  size="sm"
                  tone="ghost"
                  disabled={busy !== null}
                  onClick={() => generate(v.platform)}
                >
                  <RefreshCw size={13} />{' '}
                  {busy === `gen:${v.platform}`
                    ? `Rewriting… ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
                    : 'Rewrite'}
                </StackButton>
                <StackButton
                  size="sm"
                  tone="ghost"
                  disabled={working}
                  onClick={() => call(`v:${v.id}`, `/api/admin/content/variants/${v.id}`, 'DELETE')}
                >
                  <Trash2 size={13} /> Delete
                </StackButton>
              </div>

              {v.approver && v.status === 'approved' && (
                <p style={{ fontSize: '.76em', opacity: 0.6, margin: '8px 0 0' }}>
                  Approved by {v.approver.name}
                </p>
              )}

              {/* Syndication. Kept below approval because that is the order it
                  happens in, and separated by a rule so the two decisions do
                  not read as one row of equivalent buttons. */}
              {v.status !== 'draft' && (
                <div style={{ borderTop: '1px solid var(--line, #E4DACA)', marginTop: 10, paddingTop: 10 }}>
                  {v.status === 'published' && v.external_url ? (
                    <p style={{ margin: 0, fontSize: '.85em' }}>
                      Published to {v.label} ·{' '}
                      <a
                        href={v.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-link"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {hostOf(v.external_url)} <ExternalLink size={11} />
                      </a>
                    </p>
                  ) : (
                    <>
                      {v.last_error && (
                        <p style={{ color: '#a1502f', fontSize: '.83em', margin: '0 0 8px' }}>
                          Last attempt failed{v.attempts > 1 ? ` (${v.attempts} tries)` : ''}:{' '}
                          {v.last_error}
                        </p>
                      )}

                      {v.syndication.ready ? (
                        <StackButton
                          size="sm"
                          disabled={working || v.status === 'queued'}
                          onClick={() => call(`v:${v.id}`, `/api/admin/content/variants/${v.id}/publish`, 'POST')}
                        >
                          <Send size={13} />{' '}
                          {v.status === 'queued' ? 'Publishing…' : `Publish to ${v.label}`}
                        </StackButton>
                      ) : (
                        <p style={{ fontSize: '.83em', opacity: 0.72, margin: '0 0 8px', lineHeight: 1.5 }}>
                          {v.syndication.reason}
                        </p>
                      )}

                      {/* Three of the five platforms will only ever be
                          copy-paste, so recording where it went by hand is a
                          first-class path, not a fallback. */}
                      {!v.syndication.automatable && data.indexation.ready && (
                        urlFor === v.id ? (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                            <input
                              autoFocus
                              value={externalUrl}
                              onChange={(e) => setExternalUrl(e.target.value)}
                              placeholder={`https://… where you posted it`}
                              style={{ flex: '1 1 260px' }}
                              disabled={working}
                            />
                            <StackButton
                              size="sm"
                              disabled={working || !externalUrl.trim()}
                              onClick={() =>
                                call(`v:${v.id}`, `/api/admin/content/variants/${v.id}/external-url`, 'POST', {
                                  external_url: externalUrl.trim(),
                                }).then(() => {
                                  setUrlFor(null);
                                  setExternalUrl('');
                                })
                              }
                            >
                              Save
                            </StackButton>
                            <StackButton size="sm" tone="ghost" onClick={() => setUrlFor(null)}>
                              Cancel
                            </StackButton>
                          </div>
                        ) : (
                          <StackButton size="sm" tone="ghost" onClick={() => { setUrlFor(v.id); setExternalUrl(''); }}>
                            <Link2 size={13} /> I posted it — record the URL
                          </StackButton>
                        )
                      )}
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {data.variants.length === 0 && data.can_generate && (
        <p style={{ fontSize: '.86em', opacity: 0.7, margin: 0 }}>
          Nothing written yet. Each platform takes its own angle, so pick the ones worth the
          reach rather than all five by reflex.
        </p>
      )}
    </section>
  );
}
