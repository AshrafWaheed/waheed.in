import type { Metadata } from 'next';
import Link from 'next/link';
import { laravelFetch } from '@/lib/laravel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights · WAHEED',
  description: 'Strategic notes on halal brand-building, growth, and digital craft — from the WAHEED studio.',
};

type ListPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  reading_mins: number | null;
  published_at: string | null;
  author: { name: string | null };
};

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

  const res = await laravelFetch(`/posts?page=${encodeURIComponent(page)}`);
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: ListPost[] = payload?.data ?? [];
  const meta = payload?.meta ?? { current_page: 1, last_page: 1 };

  return (
    <main className="blog-wrap">
      <header className="blog-hero">
        <p className="blog-eyebrow">The Journal</p>
        <h1>Insights</h1>
        <p className="blog-hero-sub">Strategic notes on halal brand-building, growth, and digital craft.</p>
      </header>

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
          {meta.current_page > 1 ? <Link href={`/blog?page=${meta.current_page - 1}`}>← Newer</Link> : <span />}
          <span>Page {meta.current_page} of {meta.last_page}</span>
          {meta.current_page < meta.last_page ? <Link href={`/blog?page=${meta.current_page + 1}`}>Older →</Link> : <span />}
        </nav>
      )}
    </main>
  );
}
