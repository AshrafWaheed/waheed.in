'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, Check, PencilLine, Trash2, RotateCcw, AlertTriangle, Bot } from 'lucide-react';
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
 * Design priority is throughput. Thirty claims is a grind, so ordering carries
 * the weight. Where an agent pass has run, its findings sort first: a claim it
 * flagged is where the work actually is, and a claim it matched against the
 * source is a glance rather than a click-through. Absent an agent pass the
 * fallback is LOW confidence first, on the reasoning that the model's own
 * uncertainty is the best available signal for where the errors hide.
 *
 * The agent lane never satisfies the gate. `Post::factCheckCleared()` reads
 * `verified_at`, and nothing on this screen writes that except a person
 * pressing a button. The machine reads sources; the human still decides.
 */

const CONFIDENCE_STYLE: Record<Claim['model_confidence'], { bg: string; fg: string; label: string }> = {
  low: { bg: '#F4E2D8', fg: '#a1502f', label: 'low confidence' },
  medium: { bg: '#F6ECD3', fg: '#9c6f1c', label: 'medium' },
  high: { bg: '#E5EFE6', fg: '#3C7A5B', label: 'high' },
};

const CONFIDENCE_RANK: Record<Claim['model_confidence'], number> = { low: 0, medium: 1, high: 2 };

/**
 * Flagged by the agent → not looked at → agent says it matched. The last group
 * is the cheap one, so it goes last: work the expensive claims while fresh.
 */
const agentRank = (c: Claim): number =>
  c.agent_verdict === 'corrected' || c.agent_verdict === 'removed' ? 0 : c.agent_verdict ? 2 : 1;

const AGENT_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  confirmed: { bg: '#E5EFE6', fg: '#3C7A5B', label: 'source checked, matches' },
  corrected: { bg: '#F6ECD3', fg: '#9c6f1c', label: 'needs a change' },
  removed: { bg: '#F4E2D8', fg: '#a1502f', label: 'suggests cutting' },
};

export default function FactGate({ initial }: { initial: DraftPayload }) {
  const [data, setData] = useState<DraftPayload>(initial);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const { pending, done, agent } = useMemo(() => {
    const p = data.claims
      .filter((c) => !c.verified_at)
      .sort(
        (a, b) =>
          agentRank(a) - agentRank(b) ||
          CONFIDENCE_RANK[a.model_confidence] - CONFIDENCE_RANK[b.model_confidence] ||
          // Unsourced claims next: nothing to click through means they need the
          // most thought, so surface them before the easy confirmations.
          Number(!!a.source_url) - Number(!!b.source_url),
      );

    const checked = data.claims.filter((c) => c.agent_verdict);
    return {
      pending: p,
      done: data.claims.filter((c) => c.verified_at),
      agent: {
        ran: checked.length > 0,
        model: checked[0]?.agent_model ?? null,
        flagged: checked.filter((c) => c.agent_verdict !== 'confirmed').length,
        matched: checked.filter((c) => c.agent_verdict === 'confirmed').length,
        // Of the ones still awaiting a human, how many the pass never reached.
        unchecked: p.filter((c) => !c.agent_verdict).length,
        corrected: p.filter((c) => c.agent_verdict === 'corrected').length,
      },
    };
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

  /**
   * Accept the whole agent pass at once. Deliberately a two-step: the shortcut
   * trades a second pair of eyes for speed, and that is worth one considered
   * press rather than a reflex on a button sitting next to thirty others.
   */
  async function acceptPass() {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/drafts/${data.post.id}/accept-agent-check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      setData(json as DraftPayload);
      setConfirmingAccept(false);
    } catch {
      setError('Network error. Nothing was saved.');
    } finally {
      setAccepting(false);
    }
  }

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
            To check ({pending.length}) —{' '}
            {agent.ran ? 'flagged first, then the easy ones' : 'least confident first'}
          </h2>

          {/* What the agent pass did and did not do. Stated plainly, because a
              reader who thinks the machine cleared these will stop reading them. */}
          {agent.ran && (
            <p style={{ fontSize: '.86em', opacity: 0.8, margin: '0 0 12px', lineHeight: 1.55 }}>
              <Bot size={13} style={{ verticalAlign: '-2px' }} /> {agent.model ?? 'An agent'} read
              every cited source: <strong>{agent.flagged}</strong> need a change,{' '}
              <strong>{agent.matched}</strong> matched what they cite. That is a recommendation, not
              a verification — the claims below are still unverified until you say otherwise.
            </p>
          )}

          {/* The shortcut. Offered only on a complete pass, because a partial one
              would clear claims nothing ever read — the exact failure the gate
              exists to prevent. */}
          {agent.ran && agent.unchecked === 0 && (
            <div
              style={{
                border: '1px solid var(--line, #E4DACA)',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 18,
                fontSize: '.9em',
              }}
            >
              {!confirmingAccept ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ opacity: 0.8 }}>
                    Not going to check these yourself? You can accept the pass wholesale.
                  </span>
                  <StackButton size="sm" tone="ghost" onClick={() => setConfirmingAccept(true)}>
                    Accept all {pending.length}
                  </StackButton>
                </div>
              ) : (
                <>
                  <strong style={{ display: 'block', marginBottom: 6 }}>
                    Accept {pending.length} claim{pending.length === 1 ? '' : 's'} on the agent pass?
                  </strong>
                  <p style={{ margin: '0 0 10px', opacity: 0.85, lineHeight: 1.55 }}>
                    Every cited source was fetched and compared against the claim. What you give up
                    is a second pair of eyes. Your name goes on the decision, and the record will
                    show these were accepted from an agent pass rather than read individually.
                    {agent.corrected > 0 && (
                      <>
                        {' '}
                        <strong>
                          {agent.corrected} claim{agent.corrected === 1 ? '' : 's'} needed a change
                        </strong>{' '}
                        — accepting says that change is already made in the article.
                      </>
                    )}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <StackButton size="sm" onClick={acceptPass} disabled={accepting}>
                      <Check size={14} /> {accepting ? 'Accepting…' : 'Yes, accept the pass'}
                    </StackButton>
                    <StackButton
                      size="sm"
                      tone="ghost"
                      onClick={() => setConfirmingAccept(false)}
                      disabled={accepting}
                    >
                      Cancel
                    </StackButton>
                  </div>
                </>
              )}
            </div>
          )}
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

                  {c.agent_verdict && (
                    <div
                      style={{
                        borderLeft: `3px solid ${AGENT_STYLE[c.agent_verdict].fg}`,
                        background: 'rgba(0,0,0,.02)',
                        borderRadius: '0 8px 8px 0',
                        padding: '10px 12px',
                        margin: '0 0 12px',
                        fontSize: '.88em',
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          color: AGENT_STYLE[c.agent_verdict].fg,
                          fontWeight: 600,
                          fontSize: '.86em',
                          letterSpacing: '.02em',
                          textTransform: 'uppercase',
                        }}
                      >
                        <Bot size={13} /> {AGENT_STYLE[c.agent_verdict].label}
                      </span>
                      {c.agent_note && (
                        <p style={{ margin: '5px 0 0', opacity: 0.85 }}>{c.agent_note}</p>
                      )}
                      {/* Kept beside the model's original citation rather than
                          replacing it — a citation that drifted is evidence
                          about the generator, and overwriting destroys it. */}
                      {c.agent_source_url && (
                        <p style={{ margin: '6px 0 0' }}>
                          Use instead:{' '}
                          <a
                            href={c.agent_source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="adm-link"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            {hostOf(c.agent_source_url)}
                            <ExternalLink size={12} />
                          </a>
                        </p>
                      )}
                    </div>
                  )}

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
                      {/* Falls back to the agent's note so an accepted pass still
                          shows its reasoning rather than an empty cell. */}
                      {(c.note ?? c.agent_note) && (
                        <span style={{ display: 'block', opacity: 0.65, fontSize: '.9em', marginTop: 2 }}>
                          {c.note ?? c.agent_note}
                        </span>
                      )}
                    </td>
                    <td style={{ width: 110, fontSize: '.78em', opacity: 0.65 }}>
                      {c.verifier?.name ?? '—'}
                      {c.verified_via === 'agent' && (
                        <span
                          style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}
                          title="Accepted from an agent pass, not read individually"
                        >
                          <Bot size={11} /> via agent
                        </span>
                      )}
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
