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

function absUrl(u: string | null): string | undefined {
  if (!u) return undefined;
  return u.startsWith('/') ? SITE + u : u;
}

function fmt(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function getPost(slug: string): Promise<Post | null> {
  const res = await laravelFetch(`/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return data?.data ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found · WAHEED' };

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
  const post = await getPost(slug);
  if (!post) notFound();

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
    </main>
  );
}
