import type { Metadata } from 'next';

/**
 * A layout that exists only to put `noindex` on the gate screen.
 *
 * `page.tsx` here is a client component and cannot export metadata, so without
 * this the screen inherited the ROOT metadata — the homepage's title, the
 * homepage's description, and `rel=canonical` pointing at the homepage.
 *
 * That is worse than it sounds, because of how the gate works: while
 * coming-soon is on, src/proxy.ts REWRITES every public URL to this screen. A
 * crawl during that window sees "coming soon" at /about, /packages and every
 * other route, each one claiming to be the homepage. robots.txt disallows
 * /coming-soon, but a disallowed URL can still be indexed from links, and the
 * rewritten URLs are not /coming-soon anyway — they are the real routes. The
 * noindex has to travel with the RESPONSE, which is what this does.
 */
export const metadata: Metadata = {
  title: 'Coming soon · WAHEED',
  robots: { index: false, follow: false },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
