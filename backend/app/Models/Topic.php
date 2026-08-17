<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A planned article from the keyword strategy, waiting to be written.
 *
 * See documents/CONTENT_ENGINE.md §6 stage 1 — the queue is the input to the
 * generator, not a free-text box, so each generated post inherits its target
 * keyword and the service page it has to link to.
 */
class Topic extends Model
{
    protected $fillable = [
        'title', 'pillar', 'primary_keyword', 'secondary_keywords',
        'difficulty', 'bridge_target', 'priority', 'status', 'post_id', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'secondary_keywords' => 'array',
            'priority' => 'integer',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /** Next up: unclaimed topics, highest priority first. */
    public function scopeQueued($query)
    {
        return $query->where('status', 'queued')->orderBy('priority')->orderBy('id');
    }
}
