/**
 * Client-side helper for generation that runs on the queue.
 *
 * Generation takes one to nine minutes. The request path gives up at sixty
 * seconds, so the endpoints return 202 with a job handle and the browser polls
 * this until the work lands. Shared rather than reimplemented per panel: three
 * copies of a polling loop is three places to get the cancellation wrong and
 * leave a timer running against an unmounted component.
 */

export type JobStatus = 'queued' | 'running' | 'done' | 'failed';

export type ContentJobHandle = {
  id: number;
  kind: 'draft' | 'revise' | 'variant' | 'extract';
  status: JobStatus;
  platform: string | null;
  topic_id: number | null;
  post_id: number | null;
  variant_id: number | null;
  error: string | null;
  /** Set only by jobs whose product is not a row elsewhere, i.e. a learning batch. */
  result: Record<string, unknown> | null;
  elapsed_seconds: number | null;
};

/** Poll every three seconds: work this long does not need a tighter loop. */
const INTERVAL_MS = 3000;

/**
 * Give up well after the server would have. The worker kills a job at
 * CONTENT_TIMEOUT + 120s and marks it failed, so this ceiling exists only for
 * the case where the browser cannot reach the server at all.
 */
const CEILING_MS = 20 * 60 * 1000;

export class JobFailedError extends Error {}

/**
 * Start a generation and resolve when it finishes.
 *
 * `onTick` is called with each poll so the caller can show elapsed time rather
 * than a spinner that gives no sign of progress across several minutes.
 */
export async function runContentJob(
  url: string,
  body: unknown,
  opts: { onTick?: (job: ContentJobHandle) => void; signal?: AbortSignal } = {},
): Promise<ContentJobHandle> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: opts.signal,
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 409 means something is already running for this post; the server hands
    // back that job so we can watch it instead of erroring the user out.
    if (res.status === 409 && json.job) {
      return poll(json.job.id, opts);
    }
    throw new JobFailedError(json.message ?? `Failed (${res.status}).`);
  }

  if (!json.job?.id) throw new JobFailedError('The server did not return a job to watch.');

  return poll(json.job.id, opts);
}

export async function poll(
  jobId: number,
  opts: { onTick?: (job: ContentJobHandle) => void; signal?: AbortSignal } = {},
): Promise<ContentJobHandle> {
  const startedAt = Date.now();

  for (;;) {
    if (opts.signal?.aborted) throw new JobFailedError('Cancelled.');
    if (Date.now() - startedAt > CEILING_MS) {
      throw new JobFailedError(
        'Stopped watching after twenty minutes. The run may still be going — reload to check.',
      );
    }

    await new Promise((r) => setTimeout(r, INTERVAL_MS));

    let job: ContentJobHandle;
    try {
      const res = await fetch(`/api/admin/content/jobs/${jobId}`, { signal: opts.signal });
      if (!res.ok) continue; // a blip mid-run is not a reason to abandon minutes of work
      job = (await res.json()) as ContentJobHandle;
    } catch {
      continue;
    }

    opts.onTick?.(job);

    if (job.status === 'done') return job;
    if (job.status === 'failed') {
      throw new JobFailedError(job.error ?? 'Generation failed.');
    }
  }
}
