'use client';

import { useState } from 'react';
import { Search, Check, ExternalLink, RotateCcw } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import type { Indexation, VariantPayload } from './page';

/**
 * The indexation gate (documents/CONTENT_ENGINE.md §2 P4).
 *
 * Nothing syndicates until Google has indexed the original. Publish the
 * LinkedIn and Medium versions first and the index learns the piece lives on
 * their domain — they outrank a young site on authority alone, so the copy
 * wins and the original is treated as the derivative. It is one of the few SEO
 * mistakes that is genuinely hard to undo, because reversing it means asking
 * Google to change an attribution it already made confidently.
 *
 * Two ways to satisfy it, and the difference is recorded rather than hidden:
 * Search Console can be asked directly when the scope is granted, and a person
 * can confirm by hand when it is not. The manual route is not a stopgap — a
 * gate that cannot be satisfied until someone finishes a Google Cloud console
 * setup is a gate people work around instead of using.
 */
export default function IndexationGate({
  initial,
  postId,
  postSlug,
  onChange,
}: {
  initial: Indexation;
  postId: number;
  postSlug: string;
  onChange: (next: VariantPayload | null, indexation: Indexation) => void;
}) {
  const [data, setData] = useState<Indexation>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<{ verdict: string; coverage: string | null } | null>(null);

  async function call(key: string, path: string, body?: unknown) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/drafts/${postId}/indexation${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      setData(json as Indexation);
      if (json.check) setCheck({ verdict: json.check.verdict, coverage: json.check.coverage });

      // The variant panel's per-variant gates depend on this, so refetch it.
      const vres = await fetch(`/api/admin/content/drafts/${postId}/variants`);
      onChange(vres.ok ? ((await vres.json()) as VariantPayload) : null, json as Indexation);
    } catch {
      setError('Network error. Nothing was saved.');
    } finally {
      setBusy(null);
    }
  }

  const indexed = !!data.indexed_at;

  return (
    <div
      style={{
        border: '1px solid var(--line, #E4DACA)',
        borderLeft: `3px solid ${indexed ? '#3C7A5B' : '#9c7d1c'}`,
        borderRadius: 10,
        padding: '12px 15px',
        marginBottom: 14,
        fontSize: '.89em',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Search size={14} /> Indexation
        </strong>
        <span
          style={{
            background: indexed ? '#E5EFE6' : '#F6ECD3',
            color: indexed ? '#3C7A5B' : '#9c6f1c',
            fontSize: '.7rem', letterSpacing: '.04em', textTransform: 'uppercase',
            padding: '.2em .55em', borderRadius: 999,
          }}
        >
          {indexed ? 'indexed' : 'not yet'}
        </span>
        <a
          href={`/blog/${postSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="adm-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.85em' }}
        >
          view the article <ExternalLink size={11} />
        </a>
      </div>

      {!data.ready && data.reason && (
        <p style={{ margin: '0 0 10px', opacity: 0.85, lineHeight: 1.55 }}>{data.reason}</p>
      )}

      {indexed && (
        <p style={{ margin: '0 0 10px', opacity: 0.75 }}>
          Confirmed {new Date(data.indexed_at!).toLocaleDateString()}. Syndication is open.
        </p>
      )}

      {check && (
        <p style={{ margin: '0 0 10px', opacity: 0.75 }}>
          Search Console says <strong>{check.verdict}</strong>
          {check.coverage ? ` — ${check.coverage}` : ''}.
        </p>
      )}

      {error && (
        <p style={{ color: '#a1502f', margin: '0 0 10px' }} role="alert">{error}</p>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {/* Only offered when the scope is actually granted; otherwise the
            button exists purely to produce an explanatory 422. */}
        {data.can_query && (
          <StackButton
            size="sm"
            tone="ghost"
            disabled={busy !== null}
            onClick={() => call('check', '/check')}
          >
            {busy === 'check' ? 'Asking Google…' : 'Ask Search Console'}
          </StackButton>
        )}

        {!indexed ? (
          <StackButton
            size="sm"
            tone="ghost"
            disabled={busy !== null || data.post_status !== 'published'}
            title={data.post_status !== 'published' ? 'Publish the article first' : undefined}
            onClick={() => call('confirm', '/confirm', { indexed: true })}
          >
            <Check size={13} /> I checked, it is indexed
          </StackButton>
        ) : (
          <StackButton
            size="sm"
            tone="ghost"
            disabled={busy !== null}
            onClick={() => call('confirm', '/confirm', { indexed: false })}
          >
            <RotateCcw size={13} /> Undo
          </StackButton>
        )}
      </div>

      {!data.can_query && (
        <p style={{ fontSize: '.82em', opacity: 0.6, margin: '8px 0 0', lineHeight: 1.5 }}>
          Search Console is not connected, so this is on your word. To automate it: enable the
          Search Console API on the Google project, add <code>webmasters.readonly</code> to the
          consent screen, set <code>CONTENT_GOOGLE_SCOPES=true</code>, and reconnect Google.
        </p>
      )}
    </div>
  );
}
