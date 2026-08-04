export interface RecentPost {
  title: string;
  slug: string;
  author: { name: string | null };
  published_at: string | null;
}

/**
 * The newest published posts, for the footer.
 *
 * CACHED, unlike every other call to Laravel in this app — and that is the
 * whole reason this lives here rather than going through `laravelFetch`, which
 * hardcodes `cache: 'no-store'`. The footer renders on EVERY page, so an
 * uncached read would put a loopback round trip on the critical path of every
 * request on the site to display three links that change a few times a month.
 *
 * Five minutes is the trade: a newly published post reaches the footer within
 * that, and the blog index itself stays live-fresh because it does its own
 * uncached fetch.
 *
 * Never throws. The footer is chrome — if the API is down, the column simply
 * does not render, which is the correct failure for something nobody visited
 * the page for.
 */
export async function recentPosts(limit = 3): Promise<RecentPost[]> {
  const base = process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:8000/api';

  try {
    const res = await fetch(`${base}/posts?per_page=${limit}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300, tags: ['posts'] },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as { data?: RecentPost[] };

    return (json.data ?? []).slice(0, limit);
  } catch {
    return [];
  }
}
