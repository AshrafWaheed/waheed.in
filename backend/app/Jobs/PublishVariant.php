<?php

namespace App\Jobs;

use App\Models\PostVariant;
use App\Services\Content\Publishing\Syndicator;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Sends one approved variant to its platform.
 *
 * Unlike generation, this one DOES retry. The difference is what failure means:
 * a generation that fails has burned several minutes of agent time and should
 * surface to a human, whereas this is an HTTP call to someone else's API where
 * the common failures — a timeout, a 429, a transient 503 — are exactly the
 * ones a retry fixes.
 *
 * The dangerous case is a request that succeeded at the far end and failed on
 * the way back, where retrying double-posts. The adapter guards it by treating
 * "accepted but no URL returned" as fatal rather than retryable, so the retry
 * path only covers failures where nothing was created.
 */
class PublishVariant implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    /** Wait longer each time: most of what this hits is rate limiting. */
    public array $backoff = [30, 120];

    public function __construct(public int $variantId)
    {
        $this->onConnection('content')->onQueue('content');
    }

    public function handle(Syndicator $syndicator): void
    {
        $variant = PostVariant::find($this->variantId);
        if (! $variant || $variant->status === 'published') {
            return; // deleted, or a previous attempt already landed it
        }

        $variant->increment('attempts');

        $published = $syndicator->publish($variant);

        Log::info('variant published', [
            'variant' => $published->id,
            'platform' => $published->platform,
            'url' => $published->external_url,
        ]);
    }

    /**
     * After the last attempt. The variant goes back to `approved` rather than
     * staying `queued`, so it is visibly waiting for a person instead of
     * looking like it is still on its way.
     */
    public function failed(?Throwable $e): void
    {
        PostVariant::where('id', $this->variantId)
            ->where('status', '!=', 'published')
            ->update([
                'status' => 'failed',
                'last_error' => mb_substr($e?->getMessage() ?? 'Publishing failed.', 0, 1000),
            ]);
    }
}
