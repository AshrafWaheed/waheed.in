<?php

namespace App\Services\Content;

use App\Models\Post;
use App\Models\Topic;

/**
 * The menu of internal pages a generated post is allowed to link to.
 *
 * Without this the generator cannot link internally at all — it has no idea
 * what exists on waheed.in, so it writes a well-cited article with fifteen
 * outbound links and nothing pointing back into the site. That is the exact
 * opposite of what the content strategy is for: every post is supposed to feed
 * the service page it implies, and to knit into its pillar cluster.
 *
 * Only real, live URLs go in this list. A hallucinated internal link is a 404
 * for a reader and a broken signal for a crawler, so the generator is given the
 * closed set rather than being trusted to guess.
 */
class SiteContext
{
    /** The six service pages, which are the commercial destinations. */
    private const SERVICES = [
        '/services/web-development' => 'Halal web design and development for Muslim businesses',
        '/services/app-development' => 'Islamic app development, iOS and Android',
        '/services/seo' => 'SEO for Muslim and Islamic businesses',
        '/services/social-media-marketing' => 'Social media marketing for Muslim businesses',
        '/services/brand-strategy' => 'Islamic branding and Muslim brand strategy',
        '/services/custom-software-development' => 'Custom software, masjid/madrasa and zakat systems',
    ];

    private const PAGES = [
        '/about' => 'About WAHEED, a Muslim-led digital agency',
        '/contact' => 'Book a free clarity call',
        '/packages' => 'Packages and pricing',
    ];

    /**
     * A prompt-ready list of linkable internal targets.
     *
     * Published sibling posts are included so the generator can build the
     * pillar cluster; drafts are excluded because linking to an unpublished
     * URL ships a 404.
     */
    public function linkMenu(?Topic $topic = null): string
    {
        $lines = [];

        $lines[] = 'SERVICE PAGES (commercial destinations):';
        foreach (self::SERVICES as $url => $what) {
            $mark = $topic?->bridge_target === $url ? '  <<< THIS POST\'S BRIDGE TARGET' : '';
            $lines[] = "  {$url} — {$what}{$mark}";
        }

        $lines[] = '';
        $lines[] = 'OTHER PAGES:';
        foreach (self::PAGES as $url => $what) {
            $lines[] = "  {$url} — {$what}";
        }

        $published = Post::published()
            ->select('slug', 'title', 'excerpt')
            ->latest('published_at')
            ->limit(30)
            ->get();

        $lines[] = '';
        if ($published->isEmpty()) {
            $lines[] = 'PUBLISHED ARTICLES: none yet. Do not invent /blog/... links —';
            $lines[] = 'there is nothing there to link to. Use the pages above only.';
        } else {
            $lines[] = 'PUBLISHED ARTICLES (link where genuinely relevant):';
            foreach ($published as $p) {
                $lines[] = "  /blog/{$p->slug} — {$p->title}";
            }
        }

        return implode("\n", $lines);
    }

    /** Every URL the generator may legitimately link to, for validation. */
    public function allowedInternalUrls(): array
    {
        return array_merge(
            array_keys(self::SERVICES),
            array_keys(self::PAGES),
            Post::published()->pluck('slug')->map(fn ($s) => "/blog/{$s}")->all(),
        );
    }
}
