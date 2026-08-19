<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One learned observation about the house voice. See the migration for why
 * versioning uses a from/to pair rather than a counter.
 */
class StyleRule extends Model
{
    protected $fillable = [
        'rule', 'category', 'rationale', 'status', 'evidence', 'evidence_count',
        'effective_from', 'effective_to', 'batch', 'last_reinforced_at', 'supersedes_id',
        'approved_by', 'approved_at', 'decision_note',
    ];

    /** Mirrors the column defaults, so a freshly created model is not half-null. */
    protected $attributes = [
        'status' => 'proposed',
        'category' => 'voice',
        'evidence_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'evidence' => 'array',
            'approved_at' => 'datetime',
            'last_reinforced_at' => 'datetime',
            'effective_from' => 'integer',
            'effective_to' => 'integer',
            'evidence_count' => 'integer',
        ];
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopeProposed(Builder $query): Builder
    {
        return $query->where('status', 'proposed');
    }

    /** The set that was live at a given ruleset version. P5, reconstructable. */
    public function scopeAtVersion(Builder $query, int $version): Builder
    {
        return $query->whereNotNull('effective_from')
            ->where('effective_from', '<=', $version)
            ->where(fn ($q) => $q->whereNull('effective_to')->orWhere('effective_to', '>', $version));
    }

    /**
     * How many drafts have been generated since this rule was last seen again
     * in the edits. §7 retires anything approved that goes 20 posts without
     * reinforcement — a ruleset that only ever grows is accumulation, not
     * learning, and every line of it costs context on every generation.
     */
    public function postsSinceReinforced(): int
    {
        $since = $this->last_reinforced_at ?? $this->approved_at ?? $this->created_at;

        return Post::whereNotNull('claude_session_id')->where('created_at', '>', $since)->count();
    }

    public function isStale(): bool
    {
        return $this->status === 'approved'
            && $this->postsSinceReinforced() >= (int) config('content.learning.retire_after_posts', 20);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
