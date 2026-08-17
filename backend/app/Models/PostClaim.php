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
        'post_id', 'claim', 'source_url', 'model_confidence',
        'verified_by', 'verified_at', 'verdict', 'note',
    ];

    protected function casts(): array
    {
        return ['verified_at' => 'datetime'];
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
