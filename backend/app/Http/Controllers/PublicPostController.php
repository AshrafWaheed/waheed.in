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

        $posts = Post::published()
            ->with('author')
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();

        return PublicPostListResource::collection($posts);
    }

    /** A single published post by slug (drafts 404). */
    public function show(Post $post): PublicPostResource
    {
        abort_unless($post->isPublished(), 404);

        return new PublicPostResource($post->load('author'));
    }
}
