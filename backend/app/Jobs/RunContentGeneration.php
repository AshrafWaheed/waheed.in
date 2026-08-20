<?php

namespace App\Jobs;

use App\Models\ContentJob;
use App\Models\Post;
use App\Services\Content\BlogGenerator;
use App\Services\Content\ClaimFixer;
use App\Services\Content\FactChecker;
use App\Services\Content\StyleRuleExtractor;
use App\Services\Content\VariantGenerator;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Runs one generation off the request cycle.
 *
 * Everything here is shaped by one fact: a turn takes one to nine minutes.
 *
 * `$tries = 1` is deliberate and important. The default retry behaviour would
 * re-run a generation that failed near the end, and each attempt is a fresh
 * multi-minute agent run against the plan's usage window. Worse, a partially
 * applied one could produce a second variant or a duplicate post. A failed
 * generation should surface to a human, not silently cost three more.
 *
 * `$timeout` sits above the CLI's own timeout so the process gets to fail on
 * its own terms and record why, rather than being shot by the worker first.
 */
class RunContentGeneration implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    /** No backoff, because there is no retry. */
    public bool $failOnTimeout = true;

    public function __construct(public int $contentJobId)
    {
        // Its own connection, not just its own queue name: retry_after is a
        // per-connection setting, and the default 90s would re-dispatch this
        // mid-run. See config/queue.php.
        $this->onConnection('content')->onQueue('content');
    }

    public function timeout(): int
    {
        return (int) config('content.claude.timeout', 900) + 120;
    }

    public function handle(
        BlogGenerator $blog,
        VariantGenerator $variants,
        StyleRuleExtractor $rules,
        FactChecker $facts,
        ClaimFixer $fixer,
    ): void
    {
        $job = ContentJob::find($this->contentJobId);
        if (! $job || $job->status !== 'queued') {
            return; // cancelled, or already picked up
        }

        $job->update(['status' => 'running', 'started_at' => now()]);

        try {
            match ($job->kind) {
                'draft' => $this->draft($job, $blog),
                'revise' => $this->revise($job, $blog),
                'variant' => $this->variant($job, $variants),
                'extract' => $this->extract($job, $rules),
                'factcheck' => $this->factcheck($job, $facts),
                'fix' => $this->fix($job, $fixer),
            };

            $job->update(['status' => 'done', 'finished_at' => now()]);
        } catch (Throwable $e) {
            Log::warning('content generation failed', [
                'content_job' => $job->id, 'kind' => $job->kind, 'error' => $e->getMessage(),
            ]);

            $job->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
                'finished_at' => now(),
            ]);
        }
    }

    private function draft(ContentJob $job, BlogGenerator $blog): void
    {
        $post = $blog->draft($job->topic, $job->author_id, $job->instructions);
        $job->update(['post_id' => $post->id]);
    }

    private function revise(ContentJob $job, BlogGenerator $blog): void
    {
        $post = $blog->revise($job->post, $job->instructions, $job->user_id, $job->fork);
        // A fork writes a sibling; point the job at whatever it actually produced
        // so the UI sends the user to the right draft.
        $job->update(['post_id' => $post->id]);
    }

    private function variant(ContentJob $job, VariantGenerator $variants): void
    {
        $variant = $variants->generate($job->post, $job->platform, $job->user_id, $job->instructions);
        $job->update(['variant_id' => $variant->id]);
    }

    /**
     * The learning batch. Not a generation in the usual sense: it produces no
     * post, and its output is a set of PROPOSALS nobody has agreed to yet. It
     * runs on the same queue because it has the same shape from the browser's
     * side — minutes long, and a 504 if attempted in the request cycle.
     */
    private function extract(ContentJob $job, StyleRuleExtractor $rules): void
    {
        $result = $rules->extract($job->user_id);

        $job->update(['result' => $result]);
    }

    /**
     * The machine fact-check pass. Like `extract`, it produces no post — its
     * output lands on the claims themselves, in the agent lane, and the summary
     * goes on the job so the browser has something to show when it stops
     * polling. Also like `extract`, nothing it writes clears the fact gate.
     */
    private function factcheck(ContentJob $job, FactChecker $facts): void
    {
        $result = $facts->check($job->post, $job->user_id);

        $job->update(['result' => $result]);
    }

    /**
     * Propose concrete edits for the claims the fact-check flagged.
     *
     * Produces nothing but a list on the job. Applying it is a separate call
     * behind a separate press, because this is the step where a machine would
     * otherwise be rewriting published prose on its own initiative.
     */
    private function fix(ContentJob $job, ClaimFixer $fixer): void
    {
        $result = $fixer->propose($job->post, $job->user_id);

        $job->update(['result' => $result]);
    }

    /**
     * Reached when the worker kills the job (timeout) rather than the code
     * throwing — without this the row would sit on `running` for ever and the
     * UI would spin against nothing.
     */
    public function failed(?Throwable $e): void
    {
        ContentJob::where('id', $this->contentJobId)->where('status', '!=', 'done')->update([
            'status' => 'failed',
            'error' => $e?->getMessage() ?? 'The job was stopped before it finished.',
            'finished_at' => now(),
        ]);
    }
}
