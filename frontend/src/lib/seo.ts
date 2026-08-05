import type { Metadata } from 'next';

const SITE_URL = 'https://waheed.in';
const SITE_NAME = 'WAHEED';

/**
 * The sitewide social card, as an explicit URL.
 *
 * `src/app/opengraph-image.jpg` is a Next file convention, and the convention
 * only reaches a route segment that has NOT declared `openGraph` of its own.
 * Every page here declares one — that is the whole point of `pageMeta` — so
 * without restating the image, the card silently applied to the homepage and
 * to nothing else. It did, for a while.
 *
 * Next serves the file at its plain path as well as the hashed one it emits
 * for the homepage, so pointing at it directly is safe and stays in step: edit
 * the jpg and every page picks the new one up.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'WAHEED — Ihsan-led tech and marketing. "Scale your brand online without compromising your values."',
};

export const TWITTER_IMAGE = `${SITE_URL}/twitter-image.jpg`;

type PageMetaInput = {
  /** Full <title> for the page, e.g. 'About · WAHEED'. */
  title: string;
  /** Meta description (aim for 150–160 chars). */
  description: string;
  /** Route path, e.g. '/' or '/about'. Used for canonical + og:url. */
  path: string;
  /** Optional Open Graph overrides; default to title/description. */
  ogTitle?: string;
  ogDescription?: string;
};

/**
 * Build per-page Metadata with a self-referencing canonical, page-specific Open
 * Graph tags and the sitewide card image.
 *
 * Use it on every server-rendered public page. Without it a child page
 * inherits the ROOT layout's metadata wholesale — including
 * `rel=canonical` pointing at the homepage, which tells Google the page is a
 * duplicate and asks for it to be dropped. A page whose component is
 * `'use client'` cannot export metadata at all and needs a sibling
 * `layout.tsx` that calls this; see src/app/contact/layout.tsx.
 */
export function pageMeta({ title, description, path, ogTitle, ogDescription }: PageMetaInput): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url,
      siteName: SITE_NAME,
      locale: 'en_GB',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [TWITTER_IMAGE],
    },
  };
}
