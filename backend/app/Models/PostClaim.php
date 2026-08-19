<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One factual assertion made by a generated draft, plus its source.
 *
 * The gate: while any claim on a post is unverified, the post cannot be
 * published. See documents/CONTENT_ENGINE.md §2 P2.
 */
class PostClaim extends Model
{
    protected $fillable = [
        'post_id', 'claim', 'source_url',
        'source_about', 'model_confidence',
        'verified_by', 'verified_at', 'verified_via', 'verdict', 'note',
        'agent_verdict', 'agent_note', 'agent_source_url',
        'agent_checked_at', 'agent_model',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'agent_checked_at' => 'datetime',
        ];
    }

    /**
     * An agent pass found something the human needs to look at properly, as
     * opposed to something they can confirm at a glance.
     */
    public function scopeAgentFlagged($query)
    {
        return $query->whereIn('agent_verdict', ['corrected', 'removed']);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function scopeUnverified($query)
    {
        return $query->whereNull('verified_at');
    }
}
