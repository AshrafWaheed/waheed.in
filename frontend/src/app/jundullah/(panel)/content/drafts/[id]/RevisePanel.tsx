'use client';

import { useState } from 'react';
import { GitBranch, MessageSquare } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';
import { runContentJob } from '@/lib/content-job';
import type { DraftPayload } from './page';

/**
 * The conversational half of the draft workspace.
 *
 * Every turn resumes the same `claude -p` session (`--resume <uuid>`), so the
 * model still has the research it did and the reasoning behind the draft — you
 * are continuing a conversation, not briefing a stranger who happens to have
 * the text.
 *
 * "Try an alternative" adds `--fork-session`: it branches to a new session and
 * writes a sibling draft, leaving this one untouched. That exists because the
 * expensive failure mode is destroying a good draft to test an idea that turns
 * out worse, with no way back.
 *
 * A turn takes three to seven minutes. The UI says so rather than showing a
 * spinner that looks broken.
 */

const SUGGESTIONS = [
  'Tighten the introduction. Get to the verdict faster.',
  'The tone is drifting preachy. Pull it back.',
  'Add a section on what this costs in practice.',
  'Check the statistics again — one of them looks stale.',
  'Too UK-centric. Balance it with a US example.',
];

export default function RevisePanel({
  data,
  onResult,
}: {
  data: DraftPayload;
  onResult: (next: DraftPayload) => void;
}) {
  const [instruction, setInstruction] = useState('');
  const [fork, setFork] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const turnsLeft = data.turns_max - data.turns_used;
  const exhausted = turnsLeft <= 0;

  async function send() {
    if (busy || !instruction.trim()) return;
    setBusy(true);
    setError(null);
    setElapsed(0);

    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      // Queued, not synchronous: a turn runs for minutes and the request path
      // gives up at sixty seconds. The job outlives this page.
      const job = await runContentJob(`/api/admin/content/drafts/${data.post.id}/revise`, {
        instruction: instruction.trim(),
        fork,
      });

      if (fork && job.post_id && job.post_id !== data.post.id) {
        // A fork wrote a sibling draft; this page is showing the original.
        window.location.href = `/jundullah/content/drafts/${job.post_id}`;
        return;
      }

      const res = await fetch(`/api/admin/content/drafts/${data.post.id}`);
      if (res.ok) onResult((await res.json()) as DraftPayload);
      setInstruction('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Revision failed.');
    } finally {
      clearInterval(tick);
      setBusy(false);
    }
  }

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
          <MessageSquare size={15} /> Ask for a change
        </h2>
        <span style={{ fontSize: '.78em', opacity: 0.65, fontVariantNumeric: 'tabular-nums' }}>
          {data.turns_used} of {data.turns_max} turns used
        </span>
      </div>

      <p style={{ fontSize: '.85em', opacity: 0.72, margin: '6px 0 12px' }}>
        Continues the same session, so it still has its research and its reasoning.
      </p>

      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        disabled={busy || exhausted}
        rows={3}
        placeholder="What should change?"
        style={{ width: '100%', marginBottom: 8 }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') send();
        }}
      />

      {!busy && !exhausted && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInstruction(s)}
              style={{
                background: 'none',
                border: '1px solid var(--line, #E4DACA)',
                borderRadius: 999,
                padding: '.25em .7em',
                fontSize: '.76em',
                cursor: 'pointer',
                opacity: 0.8,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          fontSize: '.84em',
          marginBottom: 12,
          cursor: busy ? 'default' : 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={fork}
          onChange={(e) => setFork(e.target.checked)}
          disabled={busy || exhausted}
          style={{ marginTop: 3 }}
        />
        <span>
          <GitBranch size={13} style={{ verticalAlign: '-2px' }} /> <strong>Try it as an alternative</strong>
          <span style={{ display: 'block', opacity: 0.7 }}>
            Writes a second draft and leaves this one alone, so you can compare instead of
            gambling a version you already like.
          </span>
        </span>
      </label>

      {error && (
        <p style={{ color: '#a1502f', fontSize: '.85em', marginBottom: 10 }} role="alert">
          {error}
        </p>
      )}

      {exhausted ? (
        <p style={{ fontSize: '.85em', opacity: 0.75, margin: 0 }}>
          This draft has used all {data.turns_max} generation turns. Edit it by hand from here.
        </p>
      ) : (
        <StackButton size="sm" onClick={send} disabled={busy || !instruction.trim()}>
          {busy ? `Working… ${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : fork ? 'Write alternative' : 'Send'}
        </StackButton>
      )}

      {busy && (
        <p style={{ fontSize: '.8em', opacity: 0.65, marginTop: 8 }}>
          Research turns take three to seven minutes. This runs on the queue, so closing the
          tab does not stop it — reopen this page and the result will be here.
        </p>
      )}
    </section>
  );
}
