import type { MetadataRoute } from 'next';
import { laravelFetch } from '@/lib/laravel';
import { getSiteMode } from '@/lib/site-config';
import { linkableServices } from '@/content/services';

const base = 'https://waheed.in';

/**
 * The date the static pages were last materially revised.
 *
 * This used to be `new Date()`, which meant every fetch of the sitemap swore
 * that all nine static pages had changed in the last second. `lastmod` is the
 * one hint in this file Google actually reads — `changefreq` and `priority`
 * are ignored outright — and it is only read for as long as it looks honest.
 * A sitemap that cries wolf on every poll gets its lastmod discounted, which
 * costs the recrawl speed the field exists to buy.
 *
 * So: bump this by hand when page copy genuinely changes. A stale-but-true
 * date is worth more than a fresh lie. Blog entries are exempt — they carry
 * their own real `published_at`.
 */
const STATIC_REVISED = new Date('2026-08-11T00:00:00.000Z');

type ListPost = { slug: string; published_at: string | null };

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  const res = await laravelFetch('/posts?per_page=50');
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: ListPost[] = payload?.data ?? [];

  return [
    { url: `${base}/blog`, lastModified: STATIC_REVISED, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : STATIC_REVISED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * Nothing is public while a gate is on, and that has to be checked HERE
   * rather than only around the blog. The proxy skips any path with a dot, so
   * /sitemap.xml is served straight through while coming-soon rewrites every
   * real route to the gate screen — meaning without this the sitemap would sit
   * there inviting crawlers to index nine pages that all return "coming soon".
   */
  const { comingSoon, maintenance } = await getSiteMode();
  if (comingSoon || maintenance) return [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                    lastModified: STATIC_REVISED, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/packages`,      lastModified: STATIC_REVISED, changeFrequency: 'monthly', priority: 0.9 },
    // Only the crafts whose pages exist — `linkableServices` is the same source
    // the nav links from, so the sitemap can never advertise a 404.
    ...linkableServices.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: STATIC_REVISED,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${base}/about`,         lastModified: STATIC_REVISED, changeFrequency: 'monthly', priority: 0.8 },
    // Both conversion endpoints. /book was missing entirely — it is the only
    // page on the site that closes a meeting without a human in the loop.
    { url: `${base}/contact`,       lastModified: STATIC_REVISED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/book`,          lastModified: STATIC_REVISED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`,           lastModified: STATIC_REVISED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,       lastModified: STATIC_REVISED, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: STATIC_REVISED, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return [...staticPages, ...(await blogEntries())];
}
