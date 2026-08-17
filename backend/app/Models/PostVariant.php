<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One platform's derivative of a post. See CONTENT_ENGINE.md §2 P7.
 *
 * Not a copy of the article. A different piece arguing from the same research,
 * carrying a canonical link back to the waheed.in original.
 */
class PostVariant extends Model
{
    protected $fillable = [
        'post_id', 'platform', 'title', 'body_html', 'tags', 'angle', 'status',
        'canonical_url', 'external_url', 'source_hash',
        'approved_at', 'approved_by', 'publish_after', 'published_at',
        'attempts', 'last_error',
        'claude_session_id', 'generator_prompt_version', 'model_id',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'approved_at' => 'datetime',
            'publish_after' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    /**
     * The fingerprint a variant is pinned to.
     *
     * Deliberately hashes the *text*, not the HTML: re-saving a post through the
     * editor can reflow markup without changing a word, and flagging every
     * variant stale over a whitespace change would train the reader to ignore
     * the flag — which costs more than the false negative of missing a purely
     * cosmetic edit.
     */
    public static function hashOf(string $bodyHtml): string
    {
        $text = html_entity_decode(strip_tags($bodyHtml));

        return sha1(preg_replace('/\s+/', ' ', trim($text)) ?? $text);
    }

    /** The article moved on after this variant was written from it. */
    public function isStale(): bool
    {
        return $this->post && $this->source_hash !== self::hashOf($this->post->body_html);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /** Config for this variant's platform, or null if it has been removed. */
    public function spec(): ?array
    {
        return config("content.platforms.{$this->platform}");
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
