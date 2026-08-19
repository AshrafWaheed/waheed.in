'use client';

import { useState } from 'react';
import { BookOpen, Check, X, Archive, Sparkles, AlertTriangle } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import { runContentJob, JobFailedError, type ContentJobHandle } from '@/lib/content-job';
import type { VoicePayload, Rule, RuleStatus } from './page';

/**
 * The approval surface for the learning loop (documents/CONTENT_ENGINE.md §7).
 *
 * The whole screen exists to make P6 real: learned rules are proposed, reviewed
 * and versioned, and nothing enters the generator's voice without someone
 * saying yes. So the primary action here is reading, not clicking — every
 * proposal shows the actual before/after text it was derived from, because a
 * rule you approve without seeing its evidence is a rule you have not reviewed.
 *
 * The comparison strip at the top is the other half. A ruleset that only grows
 * feels like progress and is indistinguishable from progress unless something
 * is measuring it, which is what the hold-out posts are for.
 */

const STATUS_STYLE: Record<RuleStatus, { bg: string; fg: string }> = {
  proposed: { bg: '#F6ECD3', fg: '#9c6f1c' },
  approved: { bg: '#E5EFE6', fg: '#3C7A5B' },
  retired: { bg: '#ECE7DE', fg: '#6b6257' },
  rejected: { bg: '#F3E3DC', fg: '#a1502f' },
};

const ORDER: RuleStatus[] = ['proposed', 'approved', 'retired', 'rejected'];

export default function VoicePanel({ initial }: { initial: VoicePayload }) {
  const [data, setData] = useState<VoicePayload>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<ContentJobHandle | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);

  async function refresh() {
    const res = await fetch('/api/admin/content/voice');
    if (res.ok) setData((await res.json()) as VoicePayload);
  }

  async function decide(rule: Rule, action: 'approve' | 'reject' | 'retire') {
    setBusy(`${action}-${rule.id}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/voice/rules/${rule.id}/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      setConfirming(null);
      await refresh();
    } catch {
      setError('Network error. Nothing was changed.');
    } finally {
      setBusy(null);
    }
  }

  async function extract() {
    setBusy('extract');
    setError(null);
    setOutcome(null);
    try {
      const finished = await runContentJob('/api/admin/content/voice/extract', {}, {
        onTick: setJob,
      });
      const r = (finished.result ?? {}) as {
        proposed?: number;
        reinforced?: number;
        edits_read?: number;
        notes?: string;
      };
      setOutcome(
        `Read ${r.edits_read ?? 0} edit(s). ${r.proposed ?? 0} new rule(s) proposed, ` +
          `${r.reinforced ?? 0} existing rule(s) reinforced.` +
          (r.notes ? `\n\n${r.notes}` : ''),
      );
      await refresh();
    } catch (e) {
      setError(
        e instanceof JobFailedError ? e.message : 'The learning batch could not be started.',
      );
    } finally {
      setBusy(null);
      setJob(null);
    }
  }

  const byStatus = (s: RuleStatus) => data.rules.filter((r) => r.status === s);
  const stale = data.rules.filter((r) => r.stale);

  return (
    <>
      {/* ── Is it working? ─────────────────────────────────────────────── */}
      <div className="adm-voice-strip">
        <Metric
          label="Ruleset"
          value={data.ruleset_version === 0 ? 'none yet' : `v${data.ruleset_version}`}
          hint={`${data.counts.approved} rule(s) in the voice`}
        />
        <Metric
          label="With the rules"
          value={pct(data.comparison.with_rules.mean_edit_burden)}
          hint={`${data.comparison.with_rules.posts} post(s) edited`}
        />
        <Metric
          label="Hold-out"
          value={pct(data.comparison.holdout.mean_edit_burden)}
          hint={`every ${data.holdout_every}th draft, no learned rules`}
        />
        <Metric
          label="Before any rules"
          value={pct(data.comparison.before_rules.mean_edit_burden)}
          hint={`${data.comparison.before_rules.posts} post(s) edited`}
        />
      </div>

      <p className="adm-voice-note">
        Edit burden is how much of the generator&apos;s wording a human changed. The hold-out
        column is the control: every {data.holdout_every}th draft is written without the learned
        rules on purpose, because a ruleset that is merely getting longer looks exactly like one
        that is teaching the model something until you have something to compare it against.
      </p>

      {/* ── Run a batch ────────────────────────────────────────────────── */}
      <div className="adm-voice-batch">
        <div>
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} /> Learn from recent edits
          </strong>
          <p style={{ margin: '.4rem 0 0', opacity: 0.75, lineHeight: 1.55 }}>
            {data.pending_edits === 0 ? (
              <>
                No unread edits. Rules come from the difference between what the generator wrote
                and what you changed it to, so edit a generated draft first.
              </>
            ) : (
              <>
                {data.pending_edits} edit(s) waiting to be read
                {data.pending_edits < data.batch_size && (
                  <> — worth waiting for about {data.batch_size}, since two edits are a habit and
                  one is a mood</>
                )}
                . Whatever it finds arrives as a proposal, not a change.
              </>
            )}
          </p>
        </div>
        <StackButton
          size="sm"
          disabled={busy !== null || data.pending_edits === 0}
          onClick={extract}
        >
          {busy === 'extract'
            ? `Reading… ${job?.elapsed_seconds ?? 0}s`
            : 'Propose rules'}
        </StackButton>
      </div>

      {outcome && (
        <div className="adm-voice-outcome" role="status">
          {outcome}
        </div>
      )}
      {error && (
        <p style={{ color: '#a1502f', margin: '0 0 1rem' }} role="alert">
          {error}
        </p>
      )}

      {stale.length > 0 && (
        <div className="adm-voice-stale">
          <AlertTriangle size={15} />
          <span>
            {stale.length} approved rule(s) have not been reinforced in{' '}
            {data.retire_after_posts} posts. Either the generator has learned them, or they were
            never really about the voice. Retiring one keeps the record and takes it out of the
            prompt; it is not a deletion.
          </span>
        </div>
      )}

      {/* ── What the model actually reads ──────────────────────────────── */}
      {data.preview && (
        <div className="adm-voice-preview">
          <button
            type="button"
            className="adm-link"
            onClick={() => setShowPreview((v) => !v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
          >
            <BookOpen size={14} />
            {showPreview ? 'Hide' : 'Show'} what gets appended to the system prompt
          </button>
          {showPreview && <pre>{data.preview}</pre>}
        </div>
      )}

      {/* ── The rules ──────────────────────────────────────────────────── */}
      {data.rules.length === 0 ? (
        <div className="adm-placeholder" style={{ textAlign: 'left' }}>
          <strong>Nothing learned yet.</strong>
          <br />
          The generator is running on the hand-written voice document alone. That is the correct
          starting state: rules are earned from edits, and there have not been enough yet.
        </div>
      ) : (
        ORDER.filter((s) => byStatus(s).length > 0).map((status) => (
          <section key={status} style={{ marginTop: '1.6rem' }}>
            <h2 style={{ fontSize: '1rem', margin: '0 0 .7rem' }}>
              {status === 'proposed' && 'Waiting on you'}
              {status === 'approved' && 'In the voice'}
              {status === 'retired' && 'Retired'}
              {status === 'rejected' && 'Turned down'}
              <span style={{ opacity: 0.5, fontWeight: 400 }}> · {byStatus(status).length}</span>
            </h2>

            {byStatus(status).map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                busy={busy}
                confirming={confirming === rule.id}
                onConfirm={() => setConfirming(confirming === rule.id ? null : rule.id)}
                onDecide={decide}
              />
            ))}
          </section>
        ))
      )}

      {/* ── The corpus ─────────────────────────────────────────────────── */}
      {data.recent_edits.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1rem', margin: '0 0 .7rem' }}>Recent edits</h2>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Blocks changed</th>
                  <th>Words</th>
                  <th>Read by a batch</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_edits.map((e) => (
                  <tr key={e.id}>
                    <td>{e.post_title ?? `#${e.post_id}`}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{e.paragraphs_changed}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.75 }}>
                      {e.words_before} → {e.words_after}
                    </td>
                    <td style={{ opacity: e.consumed ? 0.55 : 1 }}>{e.consumed ? 'yes' : 'not yet'}</td>
                    <td style={{ opacity: 0.6, fontSize: '.85em' }}>
                      {e.created_at ? new Date(e.created_at).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function RuleCard({
  rule,
  busy,
  confirming,
  onConfirm,
  onDecide,
}: {
  rule: Rule;
  busy: string | null;
  confirming: boolean;
  onConfirm: () => void;
  onDecide: (rule: Rule, action: 'approve' | 'reject' | 'retire') => void;
}) {
  const style = STATUS_STYLE[rule.status];

  return (
    <div className="adm-voice-rule" data-status={rule.status}>
      <div className="adm-voice-rule-head">
        <span className="adm-voice-chip" style={{ background: style.bg, color: style.fg }}>
          {rule.status}
        </span>
        <span className="adm-voice-chip" style={{ background: '#EFEAE1', color: '#5c5449' }}>
          {rule.category}
        </span>
        {rule.effective_from !== null && (
          <span style={{ fontSize: '.78em', opacity: 0.55 }}>
            v{rule.effective_from}
            {rule.effective_to !== null ? ` to v${rule.effective_to}` : ' onward'}
          </span>
        )}
        {rule.supersedes_id !== null && (
          <span style={{ fontSize: '.78em', opacity: 0.55 }}>
            brought back — replaces #{rule.supersedes_id}
          </span>
        )}
        {rule.stale && (
          <span className="adm-voice-chip" style={{ background: '#F6ECD3', color: '#9c6f1c' }}>
            {rule.posts_since_reinforced} posts since last seen
          </span>
        )}
      </div>

      <p className="adm-voice-rule-text">{rule.rule}</p>

      {rule.rationale && <p className="adm-voice-rule-why">{rule.rationale}</p>}

      {/* The evidence is the point. A rule approved without reading this is a
          rule that has not been reviewed, whatever the button says. */}
      {rule.evidence.length > 0 && (
        <details className="adm-voice-ev">
          <summary>
            {rule.evidence_count} supporting edit{rule.evidence_count === 1 ? '' : 's'}
          </summary>
          {rule.evidence.map((e, i) => (
            <div key={i} className="adm-voice-ev-row">
              <span className="adm-voice-ev-tag">post {e.post_id}</span>
              <p className="adm-voice-ev-before">{e.before}</p>
              <p className="adm-voice-ev-after">{e.after}</p>
            </div>
          ))}
        </details>
      )}

      {rule.decision_note && (
        <p style={{ fontSize: '.85em', opacity: 0.6, margin: '.5rem 0 0' }}>{rule.decision_note}</p>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '.7rem' }}>
        {rule.status === 'proposed' && (
          <>
            <StackButton size="sm" disabled={busy !== null} onClick={() => onDecide(rule, 'approve')}>
              {busy === `approve-${rule.id}` ? 'Adding…' : (<><Check size={13} /> Add to the voice</>)}
            </StackButton>
            <StackButton size="sm" tone="ghost" disabled={busy !== null} onClick={() => onDecide(rule, 'reject')}>
              <X size={13} /> Turn down
            </StackButton>
          </>
        )}

        {rule.status === 'approved' &&
          (confirming ? (
            <>
              <span style={{ fontSize: '.86em', opacity: 0.8, alignSelf: 'center' }}>
                Take it out of the prompt?
              </span>
              <StackButton size="sm" disabled={busy !== null} onClick={() => onDecide(rule, 'retire')}>
                {busy === `retire-${rule.id}` ? 'Retiring…' : 'Yes, retire it'}
              </StackButton>
              <StackButton size="sm" tone="ghost" disabled={busy !== null} onClick={onConfirm}>
                Keep it
              </StackButton>
            </>
          ) : (
            <StackButton size="sm" tone="ghost" disabled={busy !== null} onClick={onConfirm}>
              <Archive size={13} /> Retire
            </StackButton>
          ))}

        {(rule.status === 'rejected' || rule.status === 'retired') && (
          <StackButton size="sm" tone="ghost" disabled={busy !== null} onClick={() => onDecide(rule, 'approve')}>
            {busy === `approve-${rule.id}` ? 'Adding…' : 'Put it back in the voice'}
          </StackButton>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="adm-voice-metric">
      <span className="adm-voice-metric-label">{label}</span>
      <strong className="adm-voice-metric-value">{value}</strong>
      <span className="adm-voice-metric-hint">{hint}</span>
    </div>
  );
}

/** No sample is not zero, and printing 0% for it would be a lie the eye believes. */
function pct(v: number | null): string {
  return v === null ? 'no data' : `${Math.round(v * 100)}%`;
}
