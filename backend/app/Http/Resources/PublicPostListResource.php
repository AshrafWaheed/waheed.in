<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Post */
class PublicPostListResource extends JsonResource
{
    /**
     * Lean list payload — no body.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'cover_image' => $this->cover_image,
            'reading_mins' => $this->reading_mins,
            'published_at' => $this->published_at?->toIso8601String(),
            'author' => ['name' => $this->author?->name],
        ];
    }
}
