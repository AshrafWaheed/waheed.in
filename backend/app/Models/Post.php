<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body_html',
        'cover_image',
        'status',
        'category_id',
        'seo_title',
        'seo_desc',
        'reading_mins',
        'author_id',
        'published_at',
        // Content engine — see documents/CONTENT_ENGINE.md
        'claude_session_id',
        'topic_id',
        'generator_prompt_version',
        'style_ruleset_version',
        'model_id',
        'fact_check_state',
        'indexed_at',
        'generated_body_html',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'indexed_at' => 'datetime',
            'reading_mins' => 'integer',
            'style_ruleset_version' => 'integer',
        ];
    }

    public function claims(): HasMany
    {
        return $this->hasMany(PostClaim::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(PostVariant::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function generationRuns(): HasMany
    {
        return $this->hasMany(GenerationRun::class);
    }

    /**
     * The fact gate. A generated post with any unverified claim must not reach
     * the public — see documents/CONTENT_ENGINE.md §2 P2. Hand-written posts
     * have no claims and so pass trivially.
     */
    public function factCheckCleared(): bool
    {
        return ! $this->claims()->unverified()->exists();
    }

    // Admin routes bind by id (stable across slug edits). Public routes use an
    // explicit {post:slug} binding, so no getRouteKeyName() override here.

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /** Scope: only published posts (status + a due publish date). */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at !== null
            && $this->published_at->lessThanOrEqualTo(now());
    }
}
