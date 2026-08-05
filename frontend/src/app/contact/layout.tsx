import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

/**
 * A layout that exists ONLY to carry /contact's metadata.
 *
 * `contact/page.tsx` is `'use client'` — it owns form state — and a client
 * component cannot export `metadata`. Without this file the route silently
 * inherited the ROOT layout's metadata, which meant /contact shipped
 * `<link rel="canonical" href="https://waheed.in">`: it told Google it was a
 * duplicate of the homepage, under the homepage's title, and asked to be
 * dropped from the index. The apply page is the one page on the site whose
 * ranking is worth actual money.
 *
 * Splitting the form into a child component would work too, but this is the
 * smaller change and it touches none of the live HubSpot-wired behaviour.
 */
export const metadata: Metadata = pageMeta({
  title: 'Apply to work with us · WAHEED',
  description:
    'Tell us what you are building. Share your brand, your timeline and your budget, and we will come back to you within two working days.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
