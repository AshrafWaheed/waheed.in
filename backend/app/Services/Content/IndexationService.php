<?php

namespace App\Services\Content;

use App\Models\GoogleAccount;
use App\Models\Post;
use App\Services\GoogleOAuthService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Has Google indexed the original yet? (CONTENT_ENGINE.md §2 P4.)
 *
 * The principle it enforces: syndication never precedes indexation. Publish
 * the LinkedIn and Medium versions before Google has seen waheed.in's copy and
 * you have taught the index that the piece lives somewhere else. Those domains
 * outrank a young site on authority alone, so the copy wins, and the original
 * gets treated as the derivative. It is one of the few SEO mistakes that is
 * genuinely hard to undo, because you are asking the index to reverse an
 * attribution it made confidently.
 *
 * The check has two sources and they are not equivalent:
 *
 *   search-console — the URL Inspection API, which reports what Google itself
 *     believes about the URL. Authoritative, but needs OAuth scope, an enabled
 *     API and a verified property.
 *   manual — a person looked and said yes. Always available, and the reason
 *     the gate is usable on day one instead of blocked behind console setup.
 *
 * Which one was used is recorded rather than flattened, because "Google says
 * so" and "Ashraf says so" are different degrees of confidence and the second
 * one is the one worth re-checking.
 */
class IndexationService
{
    private const INSPECT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

    private const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

    public function __construct(private GoogleOAuthService $oauth) {}

    /** The public URL of a post, which is what Search Console knows it by. */
    public function urlFor(Post $post): string
    {
        return config('content.site_url').'/blog/'.$post->slug;
    }

    /** Can we ask Google directly, or is manual confirmation the only option? */
    public function canQuery(): bool
    {
        return $this->oauth->hasScope(GoogleAccount::first(), self::SCOPE);
    }

    /**
     * Ask Search Console about a post.
     *
     * @return array{indexed: bool, verdict: string, coverage: ?string, last_crawled: ?string, url: string}
     */
    public function query(Post $post): array
    {
        $account = GoogleAccount::first();

        if (! $this->oauth->hasScope($account, self::SCOPE)) {
            throw new RuntimeException(
                'Search Console access has not been granted. Set CONTENT_GOOGLE_SCOPES=true, '
                .'enable the Search Console API on the Google project, add '
                .'webmasters.readonly to the consent screen, then reconnect Google. '
                .'Until then, confirm indexation by hand.'
            );
        }

        $url = $this->urlFor($post);

        $res = Http::withToken($this->oauth->accessToken($account))
            ->asJson()
            ->timeout(30)
            ->post(self::INSPECT, [
                'inspectionUrl' => $url,
                'siteUrl' => config('content.google.property'),
            ]);

        if ($res->failed()) {
            Log::warning('search console inspection failed', [
                'status' => $res->status(), 'body' => mb_substr($res->body(), 0, 500),
            ]);

            throw new RuntimeException(match ($res->status()) {
                403 => 'Search Console refused the request. Usually the property in '
                    .'CONTENT_GSC_PROPERTY ('.config('content.google.property').') is not one this '
                    .'Google account owns, or is written in the wrong form. Domain properties are '
                    .'sc-domain:waheed.in; URL-prefix ones are https://waheed.in/ with the slash.',
                404 => 'Search Console has no record of that property.',
                429 => 'Search Console rate limit reached. Try again shortly.',
                default => 'Search Console returned '.$res->status().'.',
            });
        }

        $result = $res->json('inspectionResult.indexStatusResult') ?? [];
        $verdict = $result['verdict'] ?? 'VERDICT_UNSPECIFIED';

        return [
            // PASS means Google has it indexed. NEUTRAL/PARTIAL/FAIL all mean
            // it does not, for our purposes — we want a clear yes, not an
            // absence of an explicit no.
            'indexed' => $verdict === 'PASS',
            'verdict' => $verdict,
            'coverage' => $result['coverageState'] ?? null,
            'last_crawled' => $result['lastCrawlTime'] ?? null,
            'url' => $url,
        ];
    }

    /**
     * Record that a post is indexed.
     *
     * Idempotent on purpose: re-confirming should not keep moving the timestamp
     * forward, because `indexed_at` is the moment the gate opened and the
     * release schedule is measured from it.
     */
    public function markIndexed(Post $post, string $source): Post
    {
        if (! $post->indexed_at) {
            $post->forceFill(['indexed_at' => now()])->save();
            Log::info('post marked indexed', ['post' => $post->id, 'source' => $source]);
        }

        return $post->fresh();
    }

    public function clear(Post $post): Post
    {
        $post->forceFill(['indexed_at' => null])->save();

        return $post->fresh();
    }

    /**
     * Why syndication is or is not allowed to start, in the order a person
     * would hit the problems.
     *
     * @return array{ready: bool, reason: ?string}
     */
    public function gate(Post $post): array
    {
        if ($post->status !== 'published') {
            return ['ready' => false, 'reason' => 'The article is still a draft. Publish it on '
                .'waheed.in first. Syndicating something that does not exist yet points every '
                .'platform at a 404.'];
        }

        if (! $post->factCheckCleared()) {
            return ['ready' => false, 'reason' => 'The fact gate is still open on this post.'];
        }

        if (! $post->indexed_at) {
            return ['ready' => false, 'reason' => 'Google has not indexed the original yet. '
                .'Publishing the platform versions first teaches the index that this piece lives '
                .'on their domain rather than ours, and that attribution is hard to reverse.'];
        }

        return ['ready' => true, 'reason' => null];
    }
}
