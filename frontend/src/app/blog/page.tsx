import type { Metadata } from 'next';
import Link from 'next/link';
import GirihEngine from '@/components/graphics/GirihEngine';
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

/** Two letters at most — the avatar is 30px and a third initial turns to mush. */
function initials(name: string | null): string {
  if (!name) return '·';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

/**
 * The byline is its own component because it appears in four places (lead card,
 * grid card, and twice more on the post page) and the avatar/name/date/read-time
 * order is the thing that has to stay identical between them.
 */
function Byline({ post, className = '' }: { post: ListPost; className?: string }) {
  return (
    <p className={`bl-byline ${className}`}>
      {post.author?.name && (
        <>
          <span className="bl-avatar" aria-hidden="true">{initials(post.author.name)}</span>
          <span className="bl-byline-name">{post.author.name}</span>
          <span className="bl-byline-sep" aria-hidden="true" />
        </>
      )}
      <time dateTime={post.published_at ?? undefined}>{fmt(post.published_at)}</time>
      {post.reading_mins ? (
        <>
          <span className="bl-byline-sep" aria-hidden="true" />
          <span>{post.reading_mins} min read</span>
        </>
      ) : null}
    </p>
  );
}

function Card({ post }: { post: ListPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="bl-card">
      <div className="bl-card-cover">
        {post.cover_image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={post.cover_image} alt="" loading="lazy" />
        ) : (
          /* No cover is a normal state, not a broken one — an empty box would
             read as a failed image, so the slot fills with the mark instead. */
          <span className="bl-card-nocover" aria-hidden="true" />
        )}
        {post.category && <span className="bl-chip">{post.category.name}</span>}
      </div>
      <div className="bl-card-body">
        <h2 className="bl-card-title">{post.title}</h2>
        {post.excerpt && <p className="bl-card-excerpt">{post.excerpt}</p>}
        <Byline post={post} />
      </div>
    </Link>
  );
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

  // The lead slot only earns its size on an unfiltered first page. Inside a
  // filter the set is already narrow and promoting one of them is arbitrary.
  const isFirstUnfiltered = page === '1' && !category && !tag;
  const lead = isFirstUnfiltered && posts.length > 1 ? posts[0] : null;
  const rest = lead ? posts.slice(1) : posts;

  const pageHref = (n: number) => {
    const p = new URLSearchParams({ page: String(n) });
    if (category) p.set('category', category);
    if (tag) p.set('tag', tag);
    return `/blog?${p.toString()}`;
  };

  return (
    <main>
      <header className="bl-hero" data-section-color="dark">
        <div className="bl-hero-engine" aria-hidden="true">
          <GirihEngine draw="mount" spin />
        </div>
        <div className="cnt bl-hero-inner">
          <p className="ab-pill">The Journal</p>
          <h1 className="bl-hero-h1">
            Insights
          </h1>
          <p className="bl-hero-sub">
            Strategic notes on halal brand-building, growth, and digital craft.
          </p>
        </div>
      </header>

      <section className="bl-body" data-section-color="light">
        <div className="cnt">
          {filterLabel && (
            <div className="bl-filter" role="status">
              <span className="bl-filter-label">
                {filterKind}
                <b>{filterLabel}</b>
              </span>
              <Link href="/blog" className="bl-filter-clear">Clear ×</Link>
            </div>
          )}

          {posts.length === 0 ? (
            <p className="bl-empty">No articles yet. Check back soon, in shā&rsquo; Allah.</p>
          ) : (
            <>
              {lead && (
                <Link href={`/blog/${lead.slug}`} className="bl-lead">
                  <div className="bl-lead-cover">
                    {lead.cover_image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={lead.cover_image} alt="" />
                    ) : (
                      <span className="bl-card-nocover" aria-hidden="true" />
                    )}
                  </div>
                  <div className="bl-lead-body">
                    <p className="bl-lead-flag">
                      <span>Latest</span>
                      {lead.category && <span className="bl-chip bl-chip--flat">{lead.category.name}</span>}
                    </p>
                    <h2 className="bl-lead-title">{lead.title}</h2>
                    {lead.excerpt && <p className="bl-lead-excerpt">{lead.excerpt}</p>}
                    <Byline post={lead} />
                    <span className="bl-lead-cue">Read the piece →</span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="bl-grid">
                  {rest.map((p) => <Card key={p.slug} post={p} />)}
                </div>
              )}
            </>
          )}

          {meta.last_page > 1 && (
            <nav className="bl-pager" aria-label="Pagination">
              {meta.current_page > 1
                ? <Link href={pageHref(meta.current_page - 1)}>← Newer</Link>
                : <span className="is-off">← Newer</span>}
              <span className="bl-pager-count">
                {meta.current_page} / {meta.last_page}
              </span>
              {meta.current_page < meta.last_page
                ? <Link href={pageHref(meta.current_page + 1)}>Older →</Link>
                : <span className="is-off">Older →</span>}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
