<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;

class PostController extends Controller
{
    /** List posts with optional status + search filters, newest first, paginated. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Post::query()->with('author')->latest();

        $status = $request->query('status');
        if (is_string($status) && in_array($status, ['draft', 'published'], true)) {
            $query->where('status', $status);
        }

        $q = trim((string) $request->query('q', ''));
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")->orWhere('excerpt', 'like', "%{$q}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        return PostResource::collection($query->paginate($perPage)->withQueryString());
    }

    /** Create a post. */
    public function store(StorePostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $status = $data['status'] ?? 'draft';
        $body = Purifier::clean($data['body_html']);

        $post = Post::create([
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['slug'] ?? $data['title']),
            'excerpt' => $data['excerpt'] ?? null,
            'body_html' => $body,
            'cover_image' => $data['cover_image'] ?? null,
            'status' => $status,
            'category_id' => $this->resolveCategoryId($data['category'] ?? null),
            'seo_title' => $data['seo_title'] ?? null,
            'seo_desc' => $data['seo_desc'] ?? null,
            'reading_mins' => $this->readingMinutes($body),
            'author_id' => $request->user()->id,
            'published_at' => $this->resolvePublishedAt($status, $data['published_at'] ?? null, null),
        ]);

        if (array_key_exists('tags', $data)) {
            $post->tags()->sync(Tag::idsForNames($data['tags'] ?? []));
        }

        return (new PostResource($this->withEngineCounts($post)))->response()->setStatusCode(201);
    }

    /** Show a single post. */
    public function show(Post $post): PostResource
    {
        return new PostResource($this->withEngineCounts($post));
    }

    /** Update a post (partial). */
    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $data = $request->validated();

        if (array_key_exists('title', $data)) {
            $post->title = $data['title'];
        }
        if (array_key_exists('slug', $data)) {
            $post->slug = $this->uniqueSlug($data['slug'], $post->id);
        }
        if (array_key_exists('excerpt', $data)) {
            $post->excerpt = $data['excerpt'];
        }
        if (array_key_exists('body_html', $data)) {
            $post->body_html = Purifier::clean($data['body_html']);
            $post->reading_mins = $this->readingMinutes($post->body_html);
        }
        if (array_key_exists('cover_image', $data)) {
            $post->cover_image = $data['cover_image'];
        }
        if (array_key_exists('seo_title', $data)) {
            $post->seo_title = $data['seo_title'];
        }
        if (array_key_exists('seo_desc', $data)) {
            $post->seo_desc = $data['seo_desc'];
        }
        if (array_key_exists('status', $data)) {
            /*
             * The fact gate, enforced (documents/CONTENT_ENGINE.md §2 P2).
             *
             * A generated post carries one `post_claims` row per factual
             * assertion, and every one has to be checked by a human before the
             * post can go public. Doing this here rather than only in the UI is
             * the point: the gate has to hold whoever calls the API and however
             * the button is wired, or it is advice rather than a control.
             *
             * Hand-written posts have no claims and pass straight through.
             */
            if ($data['status'] === 'published' && ! $post->factCheckCleared()) {
                $outstanding = $post->claims()->unverified()->count();

                abort(422, "This post has {$outstanding} unverified factual claim(s). "
                    .'Check them at /jundullah/content/drafts/'.$post->id.' before publishing.');
            }

            $post->status = $data['status'];
        }
        if (array_key_exists('category', $data)) {
            $post->category_id = $this->resolveCategoryId($data['category']);
        }

        $post->published_at = $this->resolvePublishedAt(
            $post->status,
            array_key_exists('published_at', $data) ? $data['published_at'] : null,
            $post->published_at,
        );

        $post->save();

        if (array_key_exists('tags', $data)) {
            $post->tags()->sync(Tag::idsForNames($data['tags'] ?? []));
        }

        return new PostResource($this->withEngineCounts($post));
    }

    /** Delete a post. */
    public function destroy(Post $post): Response
    {
        $post->delete();

        return response()->noContent();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    /**
     * Load what a single-post response needs, including the outstanding claim
     * count so the editor can point at the fact gate instead of just failing to
     * publish. Deliberately not used by index(): that would be a count query per
     * row, and the list has no use for the number.
     */
    private function withEngineCounts(Post $post): Post
    {
        return $post->load(['author', 'category', 'tags'])
            ->loadCount(['claims as unverified_claims_count' => fn ($q) => $q->whereNull('verified_at')]);
    }

    /** Slugify + ensure uniqueness (ignoring the given id on update). */
    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = Str::slug($base) ?: 'post';
        $original = $slug;
        $n = 2;

        while (
            Post::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original.'-'.$n++;
        }

        return $slug;
    }

    /** Resolve a category name to its id, creating it on the fly. Empty → null. */
    private function resolveCategoryId(?string $name): ?int
    {
        $name = trim((string) $name);
        if ($name === '') {
            return null;
        }

        return Category::findOrCreateByName($name)->id;
    }

    /** Estimated reading time in minutes (~200 wpm, min 1). */
    private function readingMinutes(string $html): int
    {
        $text = trim(html_entity_decode(strip_tags($html)));
        $words = $text === '' ? 0 : str_word_count($text);

        return max(1, (int) ceil($words / 200));
    }

    /**
     * Resolve published_at: an explicit value wins; otherwise stamp now() the
     * first time a post is published; otherwise keep what was there.
     */
    private function resolvePublishedAt(string $status, ?string $input, ?Carbon $existing): ?Carbon
    {
        if ($input !== null && $input !== '') {
            return Carbon::parse($input);
        }
        if ($status === 'published' && $existing === null) {
            return Carbon::now();
        }

        return $existing;
    }
}
