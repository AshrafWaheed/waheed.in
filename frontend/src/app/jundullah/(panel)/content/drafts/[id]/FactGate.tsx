'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, Check, PencilLine, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import RevisePanel from './RevisePanel';
import type { Claim, DraftPayload } from './page';

/**
 * The fact gate (documents/CONTENT_ENGINE.md §2 P2).
 *
 * A generated post cannot publish while any claim is unverified. This is the
 * screen where that work happens, and it exists because the alternative —
 * trusting a model's confidence rating — already failed twice on the first
 * hand-written post in this niche: a superseded government statistic, and a
 * false claim about a company's ownership. Both read as perfectly plausible.
 *
 * Design priority is throughput. Thirty claims is a grind, so the unverified
 * ones sort LOW confidence first: the model's own uncertainty is the best
 * available signal for where the errors are, and checking those first means
 * the expensive mistakes surface early rather than on claim 28.
 */

const CONFIDENCE_STYLE: Record<Claim['model_confidence'], { bg: string; fg: string; label: string }> = {
  low: { bg: '#F4E2D8', fg: '#a1502f', label: 'low confidence' },
  medium: { bg: '#F6ECD3', fg: '#9c6f1c', label: 'medium' },
  high: { bg: '#E5EFE6', fg: '#3C7A5B', label: 'high' },
};

const CONFIDENCE_RANK: Record<Claim['model_confidence'], number> = { low: 0, medium: 1, high: 2 };

export default function FactGate({ initial }: { initial: DraftPayload }) {
  const [data, setData] = useState<DraftPayload>(initial);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const { pending, done } = useMemo(() => {
    const p = data.claims
      .filter((c) => !c.verified_at)
      .sort(
        (a, b) =>
          CONFIDENCE_RANK[a.model_confidence] - CONFIDENCE_RANK[b.model_confidence] ||
          // Unsourced claims next: nothing to click through means they need the
          // most thought, so surface them before the easy confirmations.
          Number(!!a.source_url) - Number(!!b.source_url),
      );
    return { pending: p, done: data.claims.filter((c) => c.verified_at) };
  }, [data.claims]);

  const total = data.claims.length;
  const verified = done.length;
  const pct = total === 0 ? 100 : Math.round((verified / total) * 100);

  async function send(claimId: number, method: 'POST' | 'DELETE', body?: unknown) {
    setBusyId(claimId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/claims/${claimId}/verify`, {
        method,
        headers: { 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      setData(json as DraftPayload);
      setNoteFor(null);
      setNote('');
    } catch {
      setError('Network error. Nothing was saved.');
    } finally {
      setBusyId(null);
    }
  }

  /*
   * `note` is a single field shared by the list, so it must only be attached to
   * the claim whose note box is actually open. Without the noteFor check,
   * typing a correction on one claim and then confirming a different one files
   * the first claim's note against the second — quietly wrong, and wrong in the
   * audit trail, which is the one place this data has to be trustworthy.
   */
  const verify = (c: Claim, verdict: Claim['verdict']) =>
    send(c.id, 'POST', { verdict, note: noteFor === c.id && note ? note : undefined });

  /** Model-supplied URLs are not guaranteed parseable, and a throw here would
   *  blank the whole page rather than one card. */
  const hostOf = (url: string): string => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url.slice(0, 40);
    }
  };

  return (
    <section className="adm-main">
      <div className="adm-list-head">
        <div>
          <h1 className="adm-h1">Fact check</h1>
          <p className="adm-list-count">
            <Link href={`/jundullah/blogs/${data.post.id}/edit`} className="adm-link">
              {data.post.title}
            </Link>
            {data.post.generator_prompt_version && (
              <> · {data.post.generator_prompt_version} · {data.post.model_id}</>
            )}
          </p>
        </div>
        <StackButton href={`/jundullah/blogs/${data.post.id}/edit`} size="sm" tone="ghost">
          Open editor
        </StackButton>
      </div>

      {/* Progress. The gate is binary, so the only number that matters is
          whether anything is still outstanding. */}
      <div
        style={{
          border: '1px solid var(--line, #E4DACA)',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 18,
          background: data.can_publish ? '#E5EFE6' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
            {verified} of {total} claims verified
          </strong>
          <span style={{ fontSize: '.85em', opacity: 0.75 }}>
            {data.can_publish ? 'Cleared to publish' : 'Publishing is blocked until all are checked'}
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: 'rgba(0,0,0,.08)',
            marginTop: 10,
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${pct}%`, height: '100%', background: '#335C67', transition: 'width .3s' }} />
        </div>
      </div>

      <RevisePanel data={data} onResult={setData} />

      {data.warnings.length > 0 && (
        <div
          style={{
            border: '1px solid #E4CE7A',
            borderLeft: '3px solid #9c7d1c',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 18,
            fontSize: '.9em',
          }}
        >
          <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <AlertTriangle size={15} /> House-rule warnings
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {data.warnings.map((w) => (
              <li key={w} style={{ marginBottom: 2 }}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p style={{ color: '#a1502f', marginBottom: 12 }} role="alert">{error}</p>
      )}

      {pending.length === 0 ? (
        <div className="adm-placeholder">
          Every claim checked. This post can publish.
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: '1rem', margin: '0 0 10px' }}>
            To check ({pending.length}) — least confident first
          </h2>
          <div style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
            {pending.map((c) => {
              const conf = CONFIDENCE_STYLE[c.model_confidence];
              const busy = busyId === c.id;
              return (
                <article
                  key={c.id}
                  style={{
                    border: '1px solid var(--line, #E4DACA)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    opacity: busy ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: conf.bg,
                        color: conf.fg,
                        fontSize: '.68rem',
                        letterSpacing: '.04em',
                        textTransform: 'uppercase',
                        padding: '.2em .55em',
                        borderRadius: 999,
                      }}
                    >
                      {conf.label}
                    </span>
                    {c.source_url ? (
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-link"
                        style={{ fontSize: '.82em', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {hostOf(c.source_url)}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '.8em', color: '#a1502f' }}>no source — check this yourself</span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 12px', lineHeight: 1.5 }}>{c.claim}</p>

                  {noteFor === c.id && (
                    <input
                      autoFocus
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What was wrong? (saved with the verdict)"
                      style={{ width: '100%', marginBottom: 8 }}
                      disabled={busy}
                    />
                  )}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <StackButton size="sm" onClick={() => verify(c, 'confirmed')} disabled={busy}>
                      <Check size={14} /> Confirmed
                    </StackButton>
                    <StackButton
                      size="sm"
                      tone="ghost"
                      disabled={busy}
                      onClick={() => (noteFor === c.id ? verify(c, 'corrected') : setNoteFor(c.id))}
                    >
                      <PencilLine size={14} /> {noteFor === c.id ? 'Save as corrected' : 'Corrected'}
                    </StackButton>
                    <StackButton size="sm" tone="ghost" onClick={() => verify(c, 'removed')} disabled={busy}>
                      <Trash2 size={14} /> Cut from post
                    </StackButton>
                  </div>

                </article>
              );
            })}
          </div>
        </>
      )}

      {done.length > 0 && (
        <>
          <h2 style={{ fontSize: '1rem', margin: '0 0 10px' }}>Checked ({done.length})</h2>
          {done.some((c) => c.verdict === 'corrected' || c.verdict === 'removed') && (
            <p style={{ fontSize: '.85em', opacity: 0.75, margin: '0 0 10px' }}>
              Anything marked <strong>corrected</strong> or <strong>cut</strong> still needs the
              change making in the{' '}
              <Link href={`/jundullah/blogs/${data.post.id}/edit`} className="adm-link">
                editor
              </Link>
              . Ticking here records the decision; it does not rewrite the article.
            </p>
          )}
          <div className="adm-table-wrap">
            <table className="adm-table">
              <tbody>
                {done.map((c) => (
                  <tr key={c.id}>
                    <td style={{ width: 90, fontSize: '.8em' }}>{c.verdict}</td>
                    <td style={{ fontSize: '.88em' }}>
                      {c.claim}
                      {c.note && (
                        <span style={{ display: 'block', opacity: 0.65, fontSize: '.9em', marginTop: 2 }}>
                          {c.note}
                        </span>
                      )}
                    </td>
                    <td style={{ width: 110, fontSize: '.78em', opacity: 0.65 }}>
                      {c.verifier?.name ?? '—'}
                    </td>
                    <td style={{ width: 44, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => send(c.id, 'DELETE')}
                        disabled={busyId === c.id}
                        title="Undo this verification"
                        aria-label="Undo this verification"
                        style={{ background: 'none', border: 0, cursor: 'pointer', opacity: 0.6 }}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
