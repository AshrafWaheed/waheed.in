'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import StackButton from '@/components/ui/StackButton';
import { runContentJob } from '@/lib/content-job';

type Author = { id: number; name: string };

/**
 * Kicks off a draft for one topic.
 *
 * The byline is chosen per post rather than fixed: there are two people here,
 * and Google's helpful-content signals reward a named author with a real bio,
 * so who wrote a piece is editorial information, not a default.
 *
 * Generation is a research turn and legitimately runs for minutes, so the
 * button stays busy rather than optimistically navigating away.
 */
export default function GenerateTopicButton({
  topicId,
  authors,
  disabled,
}: {
  topicId: number;
  authors: Author[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authorId, setAuthorId] = useState<number | ''>(authors[0]?.id ?? '');
  const [instructions, setInstructions] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  async function generate() {
    if (busy || authorId === '') return;
    setBusy(true);
    setError(null);
    setElapsed(0);
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    try {
      // Queued: research and drafting runs for minutes, well past the sixty
      // seconds the request path allows. The job survives this page.
      const job = await runContentJob(`/api/admin/content/topics/${topicId}/generate`, {
        author_id: authorId,
        instructions: instructions || undefined,
      });
      if (job.post_id) router.push(`/jundullah/content/drafts/${job.post_id}`);
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      clearInterval(tick);
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <StackButton size="sm" tone="ghost" onClick={() => setOpen(true)} disabled={disabled}>
        Generate
      </StackButton>
    );
  }

  return (
    <div style={{ textAlign: 'left', minWidth: 260 }}>
      <label style={{ display: 'block', fontSize: '.78em', opacity: 0.7, marginBottom: 4 }}>
        Byline
      </label>
      <select
        value={authorId}
        onChange={(e) => setAuthorId(Number(e.target.value))}
        disabled={busy}
        style={{ width: '100%', marginBottom: 8 }}
      >
        {authors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <label style={{ display: 'block', fontSize: '.78em', opacity: 0.7, marginBottom: 4 }}>
        Extra instructions (optional)
      </label>
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        disabled={busy}
        rows={2}
        placeholder="e.g. lead with the Ramadan angle"
        style={{ width: '100%', marginBottom: 8 }}
      />

      {error && (
        <p style={{ color: '#a1502f', fontSize: '.82em', marginBottom: 8 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <StackButton size="sm" onClick={generate} disabled={busy || authorId === ''}>
          {busy ? `Researching… ${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : 'Generate'}
        </StackButton>
        <StackButton size="sm" tone="ghost" onClick={() => setOpen(false)} disabled={busy}>
          Cancel
        </StackButton>
      </div>

      {busy && (
        <p style={{ fontSize: '.78em', opacity: 0.6, marginTop: 6 }}>
          Searching sources and drafting, on the queue. Takes a few minutes, and closing
          the tab does not stop it.
        </p>
      )}
    </div>
  );
}
