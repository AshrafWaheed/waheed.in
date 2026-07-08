<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Post */
class PublicPostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body_html' => $this->body_html,
            'cover_image' => $this->cover_image,
            'reading_mins' => $this->reading_mins,
            'seo_title' => $this->seo_title,
            'seo_desc' => $this->seo_desc,
            'published_at' => $this->published_at?->toIso8601String(),
            'author' => ['name' => $this->author?->name],
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null),
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($t) => [
                'name' => $t->name,
                'slug' => $t->slug,
            ])->values()),
        ];
    }
}
