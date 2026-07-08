import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import type { PostData } from '../../PostForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Preview · WAHEED Admin',
  robots: { index: false, follow: false },
};

function fmt(iso: string | null): string {
  if (!iso) return 'Not published yet';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PreviewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await adminApi(`/admin/posts/${id}`);
  if (!res.ok) notFound();

  const payload = (await res.json().catch(() => null)) as { data?: PostData } | null;
  const post = payload?.data;
  if (!post) notFound();

  return (
    <main className="blog-wrap adm-preview-page">
      <div className="adm-preview-bar" role="status">
        <span>
          Draft preview — <span className={`adm-badge adm-badge-${post.status}`}>{post.status}</span>
        </span>
        <Link href={`/jundullah/blogs/${post.id}/edit`} className="adm-link">← Back to editor</Link>
      </div>

      <article className="blog-article">
        <header className="blog-article-head">
          {post.category && <span className="blog-chip">{post.category.name}</span>}
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

        {post.tags.length > 0 && (
          <footer className="blog-tags" aria-label="Tags">
            {post.tags.map((t) => (
              <span key={t.slug} className="blog-chip">#{t.name}</span>
            ))}
          </footer>
        )}
      </article>
    </main>
  );
}
