import { laravelFetch } from '@/lib/laravel';
import { getSiteMode } from '@/lib/site-config';

// RSS 2.0 feed of published posts. Route Handlers are uncached by default, so
// this always reflects the latest published set. Hidden while the site is gated
// (coming-soon or maintenance — nothing is public yet).

const SITE = 'https://waheed.in';

type FeedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  author: { name: string | null };
  category: { name: string; slug: string } | null;
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const { comingSoon, maintenance } = await getSiteMode();
  if (comingSoon || maintenance) {
    return new Response('Not found', { status: 404 });
  }

  const res = await laravelFetch('/posts?per_page=50');
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: FeedPost[] = payload?.data ?? [];

  const items = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const pubDate = p.published_at ? new Date(p.published_at).toUTCString() : '';
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      ${p.published_at ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${p.author?.name ? `<dc:creator>${esc(p.author.name)}</dc:creator>` : ''}
      ${p.category ? `<category>${esc(p.category.name)}</category>` : ''}
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WAHEED · Insights</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Strategic notes on halal brand-building, growth, and digital craft — from the WAHEED studio.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
