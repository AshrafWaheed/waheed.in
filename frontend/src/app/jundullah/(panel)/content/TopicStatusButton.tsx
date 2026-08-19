'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';

/**
 * Ticks a topic off the queue.
 *
 * The engine's happy path is topic → draft → fact gate → publish, but that is
 * not the only way a topic gets finished. It can be generated here and
 * published by hand, written entirely outside the engine, or turned into
 * something that never becomes a post. A queue you can only ever add to stops
 * being a queue, and the 23 outstanding topics stop meaning anything if some
 * of them are actually done.
 *
 * Reversible on purpose. This is one click next to a row in a long table, and
 * an irreversible one-click action in that position gets pressed by accident
 * sooner or later.
 */
export default function TopicStatusButton({
  topicId,
  status,
  hasPost,
}: {
  topicId: number;
  status: string;
  hasPost: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const done = status === 'published';

  async function set(next: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/topics/${topicId}/status`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.message ?? `Failed (${res.status}).`);
        return;
      }
      router.refresh();
    } catch {
      setError('Network error. Nothing changed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <StackButton
        size="sm"
        tone="ghost"
        disabled={busy}
        /* Reopening a topic that already has a draft returns it to the draft,
           not to the unclaimed pile: the work exists and the queue should say so. */
        onClick={() => set(done ? (hasPost ? 'in_progress' : 'queued') : 'published')}
        title={
          done
            ? 'Put this topic back on the list'
            : 'Tick this off, whether or not it went out through the engine'
        }
      >
        {busy ? '…' : done ? (<><RotateCcw size={12} /> Reopen</>) : (<><Check size={12} /> Mark done</>)}
      </StackButton>
      {error && (
        <span style={{ display: 'block', color: '#a1502f', fontSize: '.75em', marginTop: 4 }}>
          {error}
        </span>
      )}
    </>
  );
}
