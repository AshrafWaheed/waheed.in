<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One generation the user asked for, tracked from click to outcome.
 *
 * See the migration for why this is separate from GenerationRun.
 */
class ContentJob extends Model
{
    protected $fillable = [
        'kind', 'status', 'topic_id', 'post_id', 'variant_id', 'platform',
        'user_id', 'author_id', 'instructions', 'fork', 'error',
        'started_at', 'finished_at',
    ];

    /**
     * Mirrors the column defaults. Without this the model returned from
     * create() carries a null status until it is refreshed, and the 202 the
     * caller gets back says the job has no state at all.
     */
    protected $attributes = [
        'status' => 'queued',
        'fork' => false,
    ];

    protected function casts(): array
    {
        return [
            'fork' => 'boolean',
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['queued', 'running']);
    }

    /**
     * How long this has been going, for a UI that has to say something honest
     * while it waits. Null once it is finished.
     */
    public function getElapsedSecondsAttribute(): ?int
    {
        if (! in_array($this->status, ['queued', 'running'], true)) {
            return null;
        }

        return (int) ($this->started_at ?? $this->created_at)->diffInSeconds(now());
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(PostVariant::class);
    }
}
