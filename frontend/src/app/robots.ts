import type { MetadataRoute } from 'next';

/**
 * robots.txt.
 *
 * Two audiences now, not one: search crawlers, and the retrieval agents behind
 * assistants. They get the same answer — see the policy note below — but they
 * have to be told separately, because a named user-agent group REPLACES the
 * `*` group for that bot rather than adding to it. That is the one rule in
 * robots.txt that bites: a `User-agent: GPTBot` block with a single Allow line
 * would have silently opened /jundullah to it.
 *
 * Hence `DISALLOW`, shared by every group.
 */

/**
 * Off-limits to everything.
 *
 *  /jundullah    the admin portal. Behind a session guard anyway; this stops
 *                the login page turning up in results.
 *  /api/         the BFF route handlers. JSON, no reason to be in an index.
 *  /coming-soon  the gate screens. They also carry `noindex` in their own
 *  /maintenance  metadata, which is the directive that actually does the work
 *                while a gate is on — see src/app/coming-soon/layout.tsx.
 *  /book/manage/ the visitor's reschedule/cancel links. The URL *is* the
 *                credential: it carries a 64-char token that lets the holder
 *                move or cancel a real booking. The page is already
 *                `noindex, nofollow` and renders client-side so a previewer
 *                sees a shell, but a token has no business in a crawl queue
 *                in the first place.
 */
const DISALLOW = ['/jundullah', '/api/', '/coming-soon', '/maintenance', '/book/manage/'];

/**
 * AI crawlers, named explicitly — currently ALLOWED, on the same terms as
 * everyone else.
 *
 * This is a business call rather than a technical one, and it is written down
 * here so it is a decision rather than a default. A studio that sells strategy
 * to a niche audience wants to be the thing an assistant names when someone
 * asks "who builds Shariah-compliant websites"; being absent from that answer
 * costs more than the training-data exposure of a public marketing site whose
 * entire purpose is to be read. There is nothing here that is not already
 * meant for a stranger to read.
 *
 * To reverse it, move a bot's name out of this list into a group of its own
 * with `disallow: '/'`. Note the two kinds mixed in below, in case only one
 * should change: OAI-SearchBot, PerplexityBot and ClaudeBot index for
 * CITATION (they produce referral traffic); GPTBot, ClaudeBot's crawl and
 * CCBot feed TRAINING. ChatGPT-User and Perplexity-User are neither — they
 * fetch a page live because a human asked about that URL, and blocking those
 * only breaks the experience of someone who already has the link.
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Bytespider',
  'CCBot',
  'Amazonbot',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_AGENTS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: 'https://waheed.in/sitemap.xml',
    host: 'https://waheed.in',
  };
}
