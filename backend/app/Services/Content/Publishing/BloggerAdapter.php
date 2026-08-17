<?php

namespace App\Services\Content\Publishing;

use App\Models\GoogleAccount;
use App\Models\PostVariant;
use App\Services\GoogleOAuthService;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Blogger v3. One of only two platforms in the set with a usable publishing API.
 *
 * Uses the same single Google account the booking module connects, with the
 * `blogger` scope added. See config/content.php → google.
 */
class BloggerAdapter implements PublishAdapter
{
    private const SCOPE = 'https://www.googleapis.com/auth/blogger';

    private const BASE = 'https://www.googleapis.com/blogger/v3/blogs';

    public function __construct(private GoogleOAuthService $oauth) {}

    public function ready(): bool
    {
        return $this->blockedReason() === null;
    }

    public function blockedReason(): ?string
    {
        if (blank(config('content.google.blogger_blog_id'))) {
            return 'CONTENT_BLOGGER_BLOG_ID is not set. It is the numeric id in the Blogger '
                .'dashboard URL when you are editing the blog.';
        }

        if (! $this->oauth->hasScope(GoogleAccount::first(), self::SCOPE)) {
            return 'The connected Google account has not granted Blogger access. Set '
                .'CONTENT_GOOGLE_SCOPES=true, enable the Blogger API v3 on the project, add the '
                .'blogger scope to the consent screen, then reconnect Google.';
        }

        return null;
    }

    public function publish(PostVariant $variant): string
    {
        if ($reason = $this->blockedReason()) {
            throw new RuntimeException($reason);
        }

        $blogId = config('content.google.blogger_blog_id');
        $account = GoogleAccount::first();

        /*
         * The canonical link is appended rather than assumed to be in the body.
         * The generator is told to include it and the warnings check for it,
         * but this is the last point before the text leaves our control, and a
         * syndicated copy with no link home is the exact thing the variant
         * design exists to prevent.
         */
        $body = $variant->body_html;
        if (! str_contains($body, $variant->canonical_url)) {
            $body .= sprintf(
                '<p><em>Originally published at <a href="%s" rel="canonical">%s</a>.</em></p>',
                e($variant->canonical_url),
                e($variant->canonical_url),
            );
        }

        $res = Http::withToken($this->oauth->accessToken($account))
            ->asJson()
            ->timeout(45)
            ->post(self::BASE."/{$blogId}/posts/", [
                'kind' => 'blogger#post',
                'title' => $variant->title,
                'content' => $body,
                'labels' => array_slice($variant->tags ?? [], 0, 20),
            ]);

        if ($res->failed()) {
            throw new RuntimeException(match ($res->status()) {
                401, 403 => 'Blogger refused the request ('.$res->status().'). The account may not '
                    .'have permission to post to blog '.$blogId.', or the Blogger API is not '
                    .'enabled on the Google project.',
                404 => "Blogger has no blog with id {$blogId}.",
                429 => 'Blogger rate limit reached.',
                default => 'Blogger returned '.$res->status().': '
                    .mb_substr((string) $res->json('error.message', $res->body()), 0, 200),
            });
        }

        $url = $res->json('url');
        if (blank($url)) {
            // Published but we cannot say where: worth failing loudly, because
            // a retry would double-post and nobody would know to look.
            throw new RuntimeException(
                'Blogger accepted the post but returned no URL. Check the blog before retrying, '
                .'because a second attempt would publish it twice.'
            );
        }

        return $url;
    }
}
