<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublicPostListResource;
use App\Http\Resources\PublicPostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicPostController extends Controller
{
    /** Published posts, newest first, paginated (no body). */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int) $request->query('per_page', 9), 1), 50);

        $query = Post::published()
            ->with(['author', 'category'])
            ->orderByDesc('published_at');

        $category = trim((string) $request->query('category', ''));
        if ($category !== '') {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        $tag = trim((string) $request->query('tag', ''));
        if ($tag !== '') {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $tag));
        }

        $posts = $query->paginate($perPage)->withQueryString();

        return PublicPostListResource::collection($posts);
    }

    /** A single published post by slug (drafts 404), with adjacent + related. */
    public function show(Post $post): PublicPostResource
    {
        abort_unless($post->isPublished(), 404);

        $post->load(['author', 'category', 'tags']);

        // Older post (published just before this one) → "next" reading.
        $next = Post::published()
            ->where('published_at', '<', $post->published_at)
            ->orderByDesc('published_at')
            ->first(['slug', 'title']);

        // Newer post (published just after this one) → "previous" reading.
        $prev = Post::published()
            ->where('published_at', '>', $post->published_at)
            ->orderBy('published_at')
            ->first(['slug', 'title']);

        $related = Post::published()
            ->whereKeyNot($post->getKey())
            ->with(['author', 'category'])
            ->orderByDesc('published_at')
            ->limit(3)
            ->get();

        return (new PublicPostResource($post))->additional([
            'prev' => $prev ? ['slug' => $prev->slug, 'title' => $prev->title] : null,
            'next' => $next ? ['slug' => $next->slug, 'title' => $next->title] : null,
            'related' => PublicPostListResource::collection($related),
        ]);
    }
}
