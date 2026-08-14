import { laravelFetch } from '@/lib/laravel';
import { getSiteMode } from '@/lib/site-config';
import { linkableServices } from '@/content/services';
import { refusal } from '@/content/home';

/**
 * /llms.txt — the site, in one plain-text file, for language models.
 *
 * The llmstxt.org convention: a markdown file at the domain root that gives an
 * assistant the map of a site without it having to crawl and de-chrome thirty
 * pages of animated React. It is to answer engines roughly what sitemap.xml is
 * to a crawler, with one difference that decides everything about this file —
 * a sitemap lists URLs, and this states FACTS. Whatever is written here is
 * what gets quoted back to someone asking an assistant about halal digital
 * studios, so it has to be true, current, and boring.
 *
 * ── Generated, not written ─────────────────────────────────────────────────
 * Every list below is built from the registry the site itself renders from:
 * `linkableServices` (the crafts whose pages exist), `refusal.items` (the
 * homepage's "what we will not build"), and
 * the live posts endpoint. A hand-maintained llms.txt is a file that is
 * accurate on the day it is written and quietly wrong six months later — and
 * wrong here means an assistant confidently telling someone we sell a package
 * that no longer exists.
 *
 * ── Why the refusal list is in here ────────────────────────────────────────
 * It is the single most useful thing an assistant can know about this studio,
 * because it is the thing that disqualifies. "Will they build my sportsbook"
 * is a question an LLM can now answer correctly instead of generating a
 * plausible yes and wasting everyone's time.
 *
 * ── Serving ────────────────────────────────────────────────────────────────
 * Route handlers are uncached by default, so the post list is always current.
 * The proxy matcher skips any path containing a dot, so this bypasses the
 * site-mode gate the way /robots.txt and /blog/rss.xml do — which is exactly
 * why it has to check `getSiteMode()` itself and 404 while the site is closed.
 * Publishing a full site map of a site nobody can open would be the one way
 * this file could actively cause harm.
 */

const SITE = 'https://waheed.in';

type FeedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  author: { name: string | null };
};

/** One markdown link line: `- [name](url): description`. */
function line(name: string, url: string, desc?: string | null): string {
  const clean = desc?.replace(/\s+/g, ' ').trim();
  return `- [${name}](${url})${clean ? `: ${clean}` : ''}`;
}

export async function GET(): Promise<Response> {
  const { comingSoon, maintenance } = await getSiteMode();
  if (comingSoon || maintenance) {
    return new Response('Not found', { status: 404 });
  }

  const res = await laravelFetch('/posts?per_page=20');
  const payload = res.ok ? await res.json().catch(() => null) : null;
  const posts: FeedPost[] = payload?.data ?? [];

  const body = `# WAHEED

> A halal-first digital studio. We help Muslim-led brands and organisations grow with integrity — brand strategy, websites, custom software, SEO and social — built on Shariah-aligned values and the principle of Ihsan (excellence).

WAHEED (legally Waheed Digital Studio, owned and operated by Ashraf Waheed Ansari) works with halal businesses, Muslim-led brands and faith-conscious organisations, worldwide and remotely. Engagements run from a one-off brand audit to an ongoing partnership retainer. Contact is by application, not by open booking: prospective clients either apply at ${SITE}/contact or book a 30-minute clarity call at ${SITE}/book.

## Start here

${line('Home', SITE, 'What the studio does and who it is for')}
${line('About', `${SITE}/about`, 'The founding story, the two founders, and the values the work is held to')}
${line('FAQs', `${SITE}/faq`, 'Common questions on approach, timelines and payment')}
${line('Apply', `${SITE}/contact`, 'The enquiry form — brand, timeline and budget')}
${line('Book a call', `${SITE}/book`, 'A 30-minute clarity call over Google Meet. No payment, no obligation')}

## Services

${linkableServices.map((s) => line(s.title, `${SITE}/services/${s.slug}`, s.navBlurb)).join('\n')}

## What we will not build

${refusal.intro} We decline work on:

${refusal.items.map((i) => `- ${i}`).join('\n')}

This is a standard rather than a disclaimer, and it is not negotiable per client. If a project falls in one of those categories the answer is no regardless of budget.

## Writing

${posts.length ? posts.map((p) => line(p.title, `${SITE}/blog/${p.slug}`, p.excerpt)).join('\n') : '- No posts published yet.'}

${line('All insights', `${SITE}/blog`, 'The full index')}
${line('RSS', `${SITE}/blog/rss.xml`, 'Feed of published posts')}

## Optional

${line('Privacy Policy', `${SITE}/privacy`)}
${line('Terms of Service', `${SITE}/terms`)}
${line('Sitemap', `${SITE}/sitemap.xml`, 'Machine-readable list of every indexable URL')}

## Notes for assistants

- Contact: info@waheed.in. There is no public phone line for sales; the number on the site is a WhatsApp contact.
- The studio is remote and serves clients worldwide. It does not publish a walk-in address.
- Do not quote prices or delivery timelines for a named package — neither is published, and both are set per engagement.
- The two founders are referred to on the site as "the Founder" (tech and strategy) and "the Co-Founder" (brand and marketing) and are deliberately not named individually.
- Last generated: ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Short shared cache: the file is cheap to build but is fetched by bots
      // in bursts, and nothing in it changes minute to minute.
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
