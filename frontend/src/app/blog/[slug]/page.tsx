import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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
    <main className="blog-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="blog-article">
        <p className="blog-back">
          <Link href="/blog">← All insights</Link>
        </p>
        <header className="blog-article-head">
          <h1>{post.title}</h1>
          <p className="blog-article-meta">
            {post.author?.name ? `${post.author.name} · ` : ''}
            {fmt(post.published_at)}
            {post.reading_mins ? ` · ${post.reading_mins} min read` : ''}
          </p>
        </header>

        {post.cover_image && (
          <div className="blog-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt={post.title} />
          </div>
        )}

        {/* body_html is sanitised server-side (mews/purifier) on save. */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.body_html }} />
      </article>

      {(prev || next) && (
        <nav className="blog-adjacent" aria-label="More insights">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="blog-adjacent-link blog-adjacent-prev">
              <span className="blog-adjacent-dir">← Previous</span>
              <span className="blog-adjacent-title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/blog/${next.slug}`} className="blog-adjacent-link blog-adjacent-next">
              <span className="blog-adjacent-dir">Next →</span>
              <span className="blog-adjacent-title">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      {related.length > 0 && (
        <section className="blog-related" aria-labelledby="related-heading">
          <h2 id="related-heading" className="blog-related-heading">More insights</h2>
          <div className="blog-grid">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                {p.cover_image && (
                  <div className="blog-card-cover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover_image} alt={p.title} loading="lazy" />
                  </div>
                )}
                <div className="blog-card-body">
                  <h3>{p.title}</h3>
                  {p.excerpt && <p className="blog-card-excerpt">{p.excerpt}</p>}
                  <p className="blog-card-meta">
                    {fmt(p.published_at)}
                    {p.reading_mins ? ` · ${p.reading_mins} min read` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
