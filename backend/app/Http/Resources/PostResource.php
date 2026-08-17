<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Post */
class PostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body_html' => $this->body_html,
            'cover_image' => $this->cover_image,
            'status' => $this->status,
            'seo_title' => $this->seo_title,
            'seo_desc' => $this->seo_desc,
            'reading_mins' => $this->reading_mins,
            // Content engine linkage. The editor and the draft workspace are two
            // views of the same post, and without this the editor has no way to
            // say so — which is exactly how someone ends up hunting for the
            // revise box on the wrong screen.
            'generated' => (bool) $this->claude_session_id,
            'unverified_claims' => $this->whenCounted('unverified_claims'),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ]),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null),
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
            ])->values()),
        ];
    }
}
