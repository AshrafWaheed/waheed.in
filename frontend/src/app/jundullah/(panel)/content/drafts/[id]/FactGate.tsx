'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, Check, PencilLine, Trash2, RotateCcw, AlertTriangle, Bot } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import RevisePanel from './RevisePanel';
import VariantPanel from './VariantPanel';
import { hostOf } from '@/lib/url';
import { runContentJob, JobFailedError, type ContentJobHandle } from '@/lib/content-job';
import type { Claim, DraftPayload, VariantPayload } from './page';

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
 *
 * `unverifiable` sorts with the flagged ones and not with the checked ones,
 * which is the whole reason it is a separate verdict. A claim whose source the
 * pass never managed to open has had LESS attention than one it never reached,
 * because the green badges around it imply the page was read.
 */
const agentRank = (c: Claim): number =>
  c.agent_verdict === 'corrected' ||
  c.agent_verdict === 'removed' ||
  c.agent_verdict === 'unverifiable'
    ? 0
    : c.agent_verdict
      ? 2
      : 1;

/** One substitution the fix pass proposes. `find` must still match the body once. */
type ProposedFix = {
  claim_id: number;
  find: string;
  replace: string;
  rationale: string;
  source_url: string | null;
};

const AGENT_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  confirmed: { bg: '#E5EFE6', fg: '#3C7A5B', label: 'source checked, matches' },
  corrected: { bg: '#F6ECD3', fg: '#9c6f1c', label: 'needs a change' },
  removed: { bg: '#F4E2D8', fg: '#a1502f', label: 'suggests cutting' },
  unverifiable: { bg: '#EEEAE3', fg: '#6b5f4e', label: 'source could not be read' },
};

export default function FactGate({
  initial,
  variants,
}: {
  initial: DraftPayload;
  variants: VariantPayload | null;
}) {
  const [data, setData] = useState<DraftPayload>(initial);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkNote, setCheckNote] = useState<string | null>(null);
  const [fixes, setFixes] = useState<ProposedFix[] | null>(null);
  const [fixSkipped, setFixSkipped] = useState<Record<string, string>>({});
  const [fixNotes, setFixNotes] = useState<string>('');
  const [fixing, setFixing] = useState(false);
  const [applying, setApplying] = useState(false);

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
        // The pass looked but never got to read the page. These cannot be
        // accepted wholesale — nothing has actually checked them.
        unverifiable: p.filter((c) => c.agent_verdict === 'unverifiable').length,
        // Flagged claims still awaiting a person: what the fix pass works on.
        fixable: p.filter(
          (c) => c.agent_verdict === 'corrected' || c.agent_verdict === 'removed',
        ).length,
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
   * Start a machine pass over the outstanding claims.
   *
   * Queued and polled like every other multi-minute call: this fetches one page
   * per claim, so it is minutes, not seconds. When it lands the draft is
   * re-fetched rather than patched from the job result — the pass touches every
   * claim row and the server payload is the only thing that knows the truth.
   */
  async function runPass() {
    setChecking(true);
    setError(null);
    setCheckNote(null);
    try {
      const job = await runContentJob(
        `/api/admin/content/drafts/${data.post.id}/factcheck`,
        {},
        {
          onTick: (j: ContentJobHandle) =>
            setCheckNote(
              j.status === 'running'
                ? `Reading the sources… ${j.elapsed_seconds ?? 0}s`
                : 'Queued…',
            ),
        },
      );

      const res = await fetch(`/api/admin/content/drafts/${data.post.id}`);
      if (res.ok) setData((await res.json()) as DraftPayload);

      const r = (job.result ?? {}) as Record<string, number | string>;
      setCheckNote(
        typeof r.checked === 'number'
          ? `Read ${r.checked} claim(s) in ${r.runs} run(s): ${r.confirmed} matched, ` +
            `${r.corrected} need a change, ${r.removed} should come out, ` +
            `${r.unverifiable} could not be checked.`
          : null,
      );
    } catch (e) {
      setError(
        e instanceof JobFailedError ? e.message : 'The fact-check pass could not be started.',
      );
      setCheckNote(null);
    } finally {
      setChecking(false);
    }
  }

  /**
   * Ask for concrete edits for the flagged claims. Proposals only — this writes
   * nothing to the article. Applying them is the separate press below.
   */
  async function proposeFixes() {
    setFixing(true);
    setError(null);
    try {
      const job = await runContentJob(
        `/api/admin/content/drafts/${data.post.id}/fixes`,
        {},
        { onTick: (j: ContentJobHandle) => setCheckNote(`Drafting the edits… ${j.elapsed_seconds ?? 0}s`) },
      );
      const r = (job.result ?? {}) as {
        fixes?: ProposedFix[];
        notes?: string;
        skipped?: Record<string, string>;
      };
      setFixes(r.fixes ?? []);
      setFixSkipped(r.skipped ?? {});
      setFixNotes(r.notes ?? '');
      setCheckNote(null);
    } catch (e) {
      setError(e instanceof JobFailedError ? e.message : 'Could not draft the edits.');
      setCheckNote(null);
    } finally {
      setFixing(false);
    }
  }

  /**
   * Write the approved edits into the article.
   *
   * The claims stay unverified afterwards on purpose: making the correction and
   * signing the claim off are two decisions, and rolling them together would
   * mean a machine edit cleared the fact gate.
   */
  async function applyFixes() {
    if (!fixes?.length) return;
    setApplying(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/drafts/${data.post.id}/fixes/apply`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fixes }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      if (json.payload) setData(json.payload as DraftPayload);
      const skipped = Object.keys(json.skipped ?? {}).length;
      setCheckNote(
        `Applied ${json.applied} edit(s) to the article` +
          (skipped ? `, ${skipped} could not be applied and still need you.` : '.') +
          ' The claims are still unverified — confirm them below.',
      );
      setFixes(null);
    } catch {
      setError('Network error. Nothing was changed.');
    } finally {
      setApplying(false);
    }
  }

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

  return (
    <section className="adm-main">
      <div className="adm-list-head">
        <div>
          <h1 className="adm-h1">Draft workspace</h1>
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

      {/* Above the claims list rather than below it: once the gate is cleared
          this is the active work, and 35 claim cards is a long way to scroll
          past to reach it. */}
      {variants && <VariantPanel initial={variants} postId={data.post.id} postSlug={data.post.slug} />}

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

          {/* Offer the machine pass when there is anything it has not read yet.
              It fetches one page per claim, so it is minutes — hence the queue,
              the elapsed counter, and no spinner pretending to be instant. */}
          {agent.unchecked > 0 && (
            <div
              style={{
                border: '1px solid var(--line, #E4DACA)',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 14,
                fontSize: '.9em',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ opacity: 0.85, flex: '1 1 260px', lineHeight: 1.55 }}>
                {agent.ran
                  ? `${agent.unchecked} claim(s) have not been read by an agent yet.`
                  : 'An agent can fetch each cited page and report what it found, so you review ' +
                    'findings instead of opening every link. It still cannot verify anything ' +
                    'for you.'}
              </span>
              <StackButton size="sm" tone="ghost" onClick={runPass} disabled={checking}>
                <Bot size={14} /> {checking ? 'Running…' : `Check ${agent.unchecked} with an agent`}
              </StackButton>
            </div>
          )}

          {checkNote && (
            <p style={{ fontSize: '.86em', opacity: 0.8, margin: '0 0 12px', lineHeight: 1.55 }}>
              {checkNote}
            </p>
          )}

          {/* The flagged claims are the ones that need the ARTICLE changed, not
              just a verdict recorded. Offer to draft those edits rather than
              handing the user a list of things to retype. */}
          {agent.fixable > 0 && fixes === null && (
            <div className="adm-fix-offer">
              <span style={{ flex: '1 1 260px', lineHeight: 1.55, opacity: 0.85 }}>
                <strong>{agent.fixable}</strong> claim{agent.fixable === 1 ? '' : 's'} need the
                article itself changed, not just a verdict. Pressing a verdict below records your
                decision; it does not edit the post.
              </span>
              <StackButton size="sm" tone="ghost" onClick={proposeFixes} disabled={fixing}>
                <PencilLine size={14} /> {fixing ? 'Drafting…' : 'Draft the edits'}
              </StackButton>
            </div>
          )}

          {/* Proposals. Shown as before/after on the exact span that changes,
              because a correction you cannot see in one glance is a correction
              nobody actually reviews. */}
          {fixes !== null && (
            <div className="adm-fix-panel">
              <strong style={{ display: 'block', marginBottom: 4 }}>
                {fixes.length === 0
                  ? 'No mechanical edit could be drafted.'
                  : `${fixes.length} edit${fixes.length === 1 ? '' : 's'} ready to apply`}
              </strong>
              <p style={{ margin: '0 0 12px', opacity: 0.8, lineHeight: 1.55 }}>
                Nothing has been changed yet. Read them, then apply.
              </p>

              {fixes.map((f) => (
                <div key={f.claim_id} className="adm-fix">
                  <div className="adm-fix-why">
                    <span className="adm-fix-id">claim {f.claim_id}</span> {f.rationale}
                  </div>
                  <div className="adm-fix-before">{f.find}</div>
                  <div className="adm-fix-after">{f.replace}</div>
                  {f.source_url && (
                    <div style={{ fontSize: '.85em', opacity: 0.75, marginTop: 4 }}>
                      citation on the record becomes {f.source_url}
                    </div>
                  )}
                </div>
              ))}

              {Object.keys(fixSkipped).length > 0 && (
                <div className="adm-fix-skipped">
                  <AlertTriangle size={13} style={{ verticalAlign: '-2px' }} /> Still needs you:
                  <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                    {Object.entries(fixSkipped).map(([id, why]) => (
                      <li key={id} style={{ marginBottom: 3 }}>
                        <strong>claim {id}</strong> — {why}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fixNotes && (
                <p style={{ fontSize: '.86em', opacity: 0.8, margin: '10px 0 0', lineHeight: 1.55 }}>
                  {fixNotes}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {fixes.length > 0 && (
                  <StackButton size="sm" onClick={applyFixes} disabled={applying}>
                    <Check size={14} />{' '}
                    {applying ? 'Applying…' : `Apply ${fixes.length} edit${fixes.length === 1 ? '' : 's'}`}
                  </StackButton>
                )}
                <StackButton size="sm" tone="ghost" onClick={() => setFixes(null)} disabled={applying}>
                  {fixes.length > 0 ? 'Not now' : 'Close'}
                </StackButton>
              </div>
            </div>
          )}

          {/* What the agent pass did and did not do. Stated plainly, because a
              reader who thinks the machine cleared these will stop reading them. */}
          {agent.ran && (
            <p style={{ fontSize: '.86em', opacity: 0.8, margin: '0 0 12px', lineHeight: 1.55 }}>
              <Bot size={13} style={{ verticalAlign: '-2px' }} /> {agent.model ?? 'An agent'}{' '}
              checked the cited sources: <strong>{agent.flagged}</strong> need a change,{' '}
              <strong>{agent.matched}</strong> matched what they cite
              {agent.unverifiable > 0 && (
                <>
                  , and <strong>{agent.unverifiable}</strong> could not be read at all
                </>
              )}
              . That is a recommendation, not a verification — the claims below are still
              unverified until you say otherwise.
            </p>
          )}

          {/* The shortcut. Offered only on a complete pass, because a partial one
              would clear claims nothing ever read — the exact failure the gate
              exists to prevent. */}
          {agent.ran && agent.unchecked === 0 && agent.unverifiable > 0 && (
            <p
              style={{
                fontSize: '.86em',
                margin: '0 0 14px',
                lineHeight: 1.55,
                opacity: 0.85,
              }}
            >
              <AlertTriangle size={13} style={{ verticalAlign: '-2px' }} /> The pass could not read
              the source for {agent.unverifiable} of these, so there is nothing to accept wholesale.
              Verify those {agent.unverifiable} by hand and the shortcut comes back for the rest.
            </p>
          )}

          {agent.ran && agent.unchecked === 0 && agent.unverifiable === 0 && (
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

                  {/* gen-v4. Read this against the claim above before opening
                      the tab: every sourcing failure this project has had was a
                      sound claim behind a page about something adjacent, and
                      that mismatch is visible here in one second. Presented as
                      the model's description, not as fact, because it is the
                      thing being checked rather than evidence for it. */}
                  {c.source_about && (
                    <p
                      style={{
                        margin: '-6px 0 12px',
                        fontSize: '.85em',
                        lineHeight: 1.5,
                        color: '#6b7a7e',
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>Says the source is: </span>
                      {c.source_about}
                    </p>
                  )}

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
