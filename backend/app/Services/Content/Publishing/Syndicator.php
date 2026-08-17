<?php

namespace App\Services\Content\Publishing;

use App\Models\PostVariant;
use App\Services\Content\IndexationService;
use RuntimeException;

/**
 * Resolves the adapter for a platform and enforces the gate in front of it.
 *
 * Every rule here exists because the failure it prevents is expensive and
 * quiet. Publishing an unapproved variant means text nobody read went out
 * under our name; publishing a stale one means arguing from a version of the
 * article that no longer exists; publishing before indexation hands the
 * canonical claim to a stronger domain.
 */
class Syndicator
{
    public function __construct(
        private BloggerAdapter $blogger,
        private IndexationService $indexation,
    ) {}

    /** Null where the platform has no usable publishing API. */
    public function adapterFor(string $platform): ?PublishAdapter
    {
        return match ($platform) {
            'blogger' => $this->blogger,
            default => null,
        };
    }

    /**
     * Everything that must be true before a variant can be sent anywhere.
     *
     * @return array{ready: bool, reason: ?string, automatable: bool}
     */
    public function gate(PostVariant $variant): array
    {
        $automatable = $this->adapterFor($variant->platform) !== null;
        $no = fn (string $reason) => ['ready' => false, 'reason' => $reason, 'automatable' => $automatable];

        if ($variant->status === 'published') {
            return $no('Already published'.($variant->external_url ? ' at '.$variant->external_url : '').'.');
        }

        if ($variant->status !== 'approved' && $variant->status !== 'queued') {
            return $no('Not approved yet. Nothing goes out under our name unread.');
        }

        if ($variant->isStale()) {
            return $no('The article changed after this was written from it.');
        }

        $post = $this->indexation->gate($variant->post);
        if (! $post['ready']) {
            return $no($post['reason']);
        }

        if (! $automatable) {
            return $no('This platform has no usable publishing API, so it is copy-paste. Use '
                .'Copy, post it, then paste the URL back in to record where it went.');
        }

        if ($reason = $this->adapterFor($variant->platform)->blockedReason()) {
            return $no($reason);
        }

        return ['ready' => true, 'reason' => null, 'automatable' => true];
    }

    /**
     * Publish one variant. Called from the queue, never inline: the HTTP call
     * is to someone else's API and can be slow or flaky.
     */
    public function publish(PostVariant $variant): PostVariant
    {
        $gate = $this->gate($variant);
        if (! $gate['ready']) {
            throw new RuntimeException($gate['reason']);
        }

        $url = $this->adapterFor($variant->platform)->publish($variant);

        $variant->update([
            'status' => 'published',
            'external_url' => $url,
            'published_at' => now(),
            'last_error' => null,
        ]);

        return $variant->fresh();
    }

    /**
     * Record a copy-paste publication a human did by hand.
     *
     * Not a lesser case. Three of the five platforms will only ever work this
     * way, and without somewhere to put the URL the system would have no
     * record of the majority of its own output.
     */
    public function recordManual(PostVariant $variant, string $url): PostVariant
    {
        $gate = $this->indexation->gate($variant->post);
        if (! $gate['ready']) {
            throw new RuntimeException($gate['reason']);
        }

        $variant->update([
            'status' => 'published',
            'external_url' => $url,
            'published_at' => now(),
            'last_error' => null,
        ]);

        return $variant->fresh();
    }
}
