import type { Metadata } from 'next';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import StackButton from '@/components/ui/StackButton';
import DeletePostButton from './DeletePostButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights · WAHEED Admin',
  robots: { index: false, follow: false },
};

type PostRow = {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  reading_mins: number | null;
  published_at: string | null;
  updated_at: string | null;
};

type Paginated = {
  data: PostRow[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BlogsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === 'string' ? sp.status : '';
  const q = typeof sp.q === 'string' ? sp.q : '';
  const page = typeof sp.page === 'string' ? sp.page : '1';

  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (q) query.set('q', q);
  query.set('page', page);

  const res = await adminApi(`/admin/posts?${query.toString()}`);
  const payload = (await res.json().catch(() => null)) as Paginated | null;
  const posts = payload?.data ?? [];
  const meta = payload?.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 15 };

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (q) p.set('q', q);
    p.set('page', String(n));
    return `/jundullah/blogs?${p.toString()}`;
  };

  return (
    <section className="adm-main">
      <div className="adm-list-head">
        <div>
          <h1 className="adm-h1">Insights</h1>
          <p className="adm-list-count">{meta.total} post{meta.total === 1 ? '' : 's'}</p>
        </div>
        <StackButton href="/jundullah/blogs/new" size="sm" className="adm-new-btn">
          New post
        </StackButton>
      </div>

      <form className="adm-filters" method="get">
        <input type="search" name="q" defaultValue={q} placeholder="Search title or excerpt…" />
        <select name="status" defaultValue={status} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <StackButton type="submit" size="sm" tone="ghost" className="adm-filter-btn">Filter</StackButton>
      </form>

      {posts.length === 0 ? (
        <div className="adm-placeholder">
          No posts found.{' '}
          <Link href="/jundullah/blogs/new" className="adm-link">Write your first one →</Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/jundullah/blogs/${p.id}/edit`} className="adm-table-title">
                      {p.title}
                    </Link>
                    <span className="adm-table-slug">/{p.slug}</span>
                  </td>
                  <td>
                    <span className={`adm-badge adm-badge-${p.status}`}>{p.status}</span>
                  </td>
                  <td className="adm-table-date">{fmtDate(p.published_at ?? p.updated_at)}</td>
                  <td className="adm-table-actions">
                    <Link href={`/jundullah/blogs/${p.id}/edit`}>Edit</Link>
                    <DeletePostButton id={p.id} title={p.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.last_page > 1 && (
        <nav className="adm-pager" aria-label="Pagination">
          {meta.current_page > 1 ? (
            <Link href={pageHref(meta.current_page - 1)} className="adm-link">← Prev</Link>
          ) : (
            <span className="adm-pager-off">← Prev</span>
          )}
          <span className="adm-pager-info">
            Page {meta.current_page} of {meta.last_page}
          </span>
          {meta.current_page < meta.last_page ? (
            <Link href={pageHref(meta.current_page + 1)} className="adm-link">Next →</Link>
          ) : (
            <span className="adm-pager-off">Next →</span>
          )}
        </nav>
      )}
    </section>
  );
}
