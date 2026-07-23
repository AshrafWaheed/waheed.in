import type { Metadata } from 'next';

const SITE_URL = 'https://waheed.in';
const SITE_NAME = 'WAHEED';

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
 * Build per-page Metadata with a self-referencing canonical and page-specific
 * Open Graph tags. Without this, child pages inherit the root layout's OG
 * title/description (and get no canonical), which is exactly the duplication
 * a crawler flags. Use on every server-rendered page.
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
    },
  };
}
