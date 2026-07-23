import type { Metadata } from 'next';
import Link from 'next/link';
import { laravelFetch } from '@/lib/laravel';

export const dynamic = 'force-dynamic';

const BLOG_DESC =
  'Strategic notes on halal brand-building, growth, and digital craft from the WAHEED studio — practical ideas to help Muslim-led brands grow with integrity.';

export const metadata: Metadata = {
  title: 'Insights · WAHEED',
  description: BLOG_DESC,
  alternates: {
    canonical: 'https://waheed.in/blog',
    types: { 'application/rss+xml': [{ url: 'https://waheed.in/blog/rss.xml', title: 'WAHEED · Insights' }] },
  },
  openGraph: {
    title: 'Insights · WAHEED',
    description: BLOG_DESC,
    url: 'https://waheed.in/blog',
    siteName: 'WAHEED',
    locale: 'en_GB',
    type: 'website',
  },
};

type ListPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  reading_mins: number | null;
  published_at: string | null;
  author: { name: string | null };
  category: { name: string; slug: string } | null;
};

function titleCase(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmt(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === 'string' ? sp.page : '1';
  const category = typeof sp.category === 'string' ? sp.category : '';
  const tag = typeof sp.tag === 'string' ? sp.tag : '';

  const query = new URLSearchParams({ page });
  if (category) query.set('category', category);
  if (tag) query.set('tag', tag);

  const res = await laravelFetch(`/posts?${query.toString()}`);
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: ListPost[] = payload?.data ?? [];
  const meta = payload?.meta ?? { current_page: 1, last_page: 1 };

  // Prefer the real category name from a result; fall back to a prettified slug.
  const filterLabel = category
    ? posts[0]?.category?.name ?? titleCase(category)
    : tag
      ? titleCase(tag)
      : '';
  const filterKind = category ? 'Category' : tag ? 'Tag' : '';

  const pageHref = (n: number) => {
    const p = new URLSearchParams({ page: String(n) });
    if (category) p.set('category', category);
    if (tag) p.set('tag', tag);
    return `/blog?${p.toString()}`;
  };

  return (
    <main className="blog-wrap">
      <header className="blog-hero">
        <p className="blog-eyebrow">The Journal</p>
        <h1>Insights</h1>
        <p className="blog-hero-sub">Strategic notes on halal brand-building, growth, and digital craft.</p>
      </header>

      {filterLabel && (
        <div className="blog-filter" role="status">
          <span>
            {filterKind}: <strong>{filterLabel}</strong>
          </span>
          <Link href="/blog" className="blog-filter-clear">× Clear</Link>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="blog-empty">No articles yet. Check back soon, in shā&rsquo; Allah.</p>
      ) : (
        <div className="blog-grid">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
              {p.cover_image && (
                <div className="blog-card-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover_image} alt={p.title} loading="lazy" />
                </div>
              )}
              <div className="blog-card-body">
                {p.category && <span className="blog-chip">{p.category.name}</span>}
                <h2>{p.title}</h2>
                {p.excerpt && <p className="blog-card-excerpt">{p.excerpt}</p>}
                <p className="blog-card-meta">
                  {fmt(p.published_at)}
                  {p.reading_mins ? ` · ${p.reading_mins} min read` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta.last_page > 1 && (
        <nav className="blog-pager" aria-label="Pagination">
          {meta.current_page > 1 ? <Link href={pageHref(meta.current_page - 1)}>← Newer</Link> : <span />}
          <span>Page {meta.current_page} of {meta.last_page}</span>
          {meta.current_page < meta.last_page ? <Link href={pageHref(meta.current_page + 1)}>Older →</Link> : <span />}
        </nav>
      )}
    </main>
  );
}
