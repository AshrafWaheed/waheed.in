import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GirihEngine from '@/components/graphics/GirihEngine';
import { laravelFetch } from '@/lib/laravel';

export const dynamic = 'force-dynamic';

const SITE = 'https://waheed.in';

type Post = {
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  cover_image: string | null;
  reading_mins: number | null;
  seo_title: string | null;
  seo_desc: string | null;
  published_at: string | null;
  author: { name: string | null };
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
};

type AdjacentLink = { slug: string; title: string } | null;

type RelatedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  reading_mins: number | null;
  published_at: string | null;
  author: { name: string | null };
  category: { name: string; slug: string } | null;
};

type PostEnvelope = {
  post: Post;
  prev: AdjacentLink;
  next: AdjacentLink;
  related: RelatedPost[];
};

function absUrl(u: string | null): string | undefined {
  if (!u) return undefined;
  return u.startsWith('/') ? SITE + u : u;
}

/** Two letters at most — the avatar is 30px and a third initial turns to mush. */
function initials(name: string | null): string {
  if (!name) return '·';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

function fmt(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function getPost(slug: string): Promise<PostEnvelope | null> {
  const res = await laravelFetch(`/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data?.data) return null;
  return {
    post: data.data,
    prev: data.prev ?? null,
    next: data.next ?? null,
    related: Array.isArray(data.related) ? data.related : (data.related?.data ?? []),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const envelope = await getPost(slug);
  if (!envelope) return { title: 'Not found · WAHEED' };
  const { post } = envelope;

  const title = post.seo_title || post.title;
  const description = post.seo_desc || post.excerpt || undefined;
  const url = `${SITE}/blog/${post.slug}`;
  const image = absUrl(post.cover_image);

  return {
    title: `${title} · WAHEED`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'WAHEED',
      images: image ? [image] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const envelope = await getPost(slug);
  if (!envelope) notFound();
  const { post, prev, next, related } = envelope;

  const image = absUrl(post.cover_image);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_desc || post.excerpt || undefined,
    image: image ? [image] : undefined,
    datePublished: post.published_at ?? undefined,
    author: post.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'WAHEED',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bl-post-hero" data-section-color="dark">
        <div className="bl-hero-engine" aria-hidden="true">
          <GirihEngine draw="mount" spin />
        </div>
        <div className="cnt bl-post-hero-inner">
          <Link href="/blog" className="bl-back">← All insights</Link>

          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`} className="bl-chip bl-chip--link">
              {post.category.name}
            </Link>
          )}

          <h1 className="bl-post-h1">{post.title}</h1>
          {post.excerpt && <p className="bl-post-standfirst">{post.excerpt}</p>}

          <p className="bl-byline bl-byline--hero">
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
        </div>
      </header>

      <article className="bl-post" data-section-color="light">
        {/* The cover straddles the hero/body boundary — it is pulled up into the
            dark section so the two halves of the page are stitched by the image
            rather than butted against each other. */}
        {post.cover_image && (
          <div className="cnt">
            <figure className="bl-post-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image} alt="" />
            </figure>
          </div>
        )}

        <div className="cnt bl-post-col">
          {/* body_html is sanitised server-side (mews/purifier) on save. */}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.body_html }} />

          {post.tags.length > 0 && (
            <footer className="bl-tags" aria-label="Tags">
              <span className="bl-tags-lbl">Filed under</span>
              {post.tags.map((t) => (
                <Link key={t.slug} href={`/blog?tag=${t.slug}`} className="bl-tag">
                  {t.name}
                </Link>
              ))}
            </footer>
          )}
        </div>

        {(prev || next) && (
          <div className="cnt">
            <nav className="bl-adjacent" aria-label="More insights">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="bl-adj bl-adj--prev">
                  <span className="bl-adj-dir">← Previous</span>
                  <span className="bl-adj-title">{prev.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/blog/${next.slug}`} className="bl-adj bl-adj--next">
                  <span className="bl-adj-dir">Next →</span>
                  <span className="bl-adj-title">{next.title}</span>
                </Link>
              ) : <span />}
            </nav>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="bl-related" data-section-color="light" aria-labelledby="related-heading">
          <div className="cnt">
            <h2 id="related-heading" className="bl-related-h">More insights</h2>
            <div className="bl-grid">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="bl-card">
                  <div className="bl-card-cover">
                    {p.cover_image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.cover_image} alt="" loading="lazy" />
                    ) : (
                      <span className="bl-card-nocover" aria-hidden="true" />
                    )}
                    {p.category && <span className="bl-chip">{p.category.name}</span>}
                  </div>
                  <div className="bl-card-body">
                    <h3 className="bl-card-title">{p.title}</h3>
                    {p.excerpt && <p className="bl-card-excerpt">{p.excerpt}</p>}
                    <p className="bl-byline">
                      {p.author?.name && (
                        <>
                          <span className="bl-avatar" aria-hidden="true">{initials(p.author.name)}</span>
                          <span className="bl-byline-name">{p.author.name}</span>
                          <span className="bl-byline-sep" aria-hidden="true" />
                        </>
                      )}
                      <time dateTime={p.published_at ?? undefined}>{fmt(p.published_at)}</time>
                      {p.reading_mins ? (
                        <>
                          <span className="bl-byline-sep" aria-hidden="true" />
                          <span>{p.reading_mins} min read</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
