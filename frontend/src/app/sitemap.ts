import type { MetadataRoute } from 'next';
import { laravelFetch } from '@/lib/laravel';
import { getSiteMode } from '@/lib/site-config';
import { linkableServices } from '@/content/services';

const base = 'https://waheed.in';

type ListPost = { slug: string; published_at: string | null };

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  // Nothing is public while the site is gated (coming-soon or maintenance).
  const { comingSoon, maintenance } = await getSiteMode();
  if (comingSoon || maintenance) return [];

  const res = await laravelFetch('/posts?per_page=50');
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: ListPost[] = payload?.data ?? [];

  return [
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/packages`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // Only the crafts whose pages exist — `linkableServices` is the same source
    // the nav links from, so the sitemap can never advertise a 404.
    ...linkableServices.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${base}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return [...staticPages, ...(await blogEntries())];
}
