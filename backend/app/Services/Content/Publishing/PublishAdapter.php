<?php

namespace App\Services\Content\Publishing;

use App\Models\PostVariant;

/**
 * One platform's publishing API.
 *
 * Only implemented for platforms that genuinely have one. Medium closed new
 * integration tokens in 2023, Substack has never shipped a publishing API, and
 * LinkedIn article posting is not in the public API — those stay copy-paste,
 * and the absence of an adapter is the honest representation of that rather
 * than a stub that throws.
 */
interface PublishAdapter
{
    /** Is this adapter configured well enough to be attempted? */
    public function ready(): bool;

    /** Human-readable reason it is not ready, for the UI. */
    public function blockedReason(): ?string;

    /**
     * Publish and return the public URL of the result.
     *
     * Throws on failure. The caller records the error and the attempt count;
     * an adapter should not swallow anything, because a silent partial success
     * is worse than a visible failure — it leaves a post live somewhere with
     * nothing in our records pointing at it.
     */
    public function publish(PostVariant $variant): string;
}
