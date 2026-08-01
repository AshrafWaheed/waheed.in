/**
 * WAHEED services catalogue — the SEVEN CRAFTS as routable pages.
 *
 * This is the register for `/services/[slug]`. It exists because three separate
 * things need the same list and must never disagree about it: the nav dropdown,
 * the sitemap, and the pages themselves.
 *
 * The order, the numbering and the titles are lifted VERBATIM from
 * `expertise.doors` in content/home.ts — that array is what the homepage bento
 * renders, so if a title drifts here the site starts saying two different names
 * for one craft. `num` is the display index (`01`…`07`), not an id.
 *
 * `soon: true` means the craft is NOT being sold yet and the link is NOT
 * navigable. The nav renders those as inert text, not as anchors, so there is
 * no route to 404 into. Flipping the flag is the entire ceremony for launching
 * one — once its page module exists.
 *
 * `soon: false` is a claim about the OFFER, not about the site. Whether a link
 * appears is decided by `pages` below, which is a map of modules that actually
 * exist. That indirection is the point: the nav cannot link to a page that has
 * not been written, so shipping the five live crafts one at a time never leaves
 * a public 404 behind.
 */
import type { ServicePage } from './types';
import webAppDevelopment from './web-app-development';

export type { ServicePage } from './types';

export interface Service {
  /** Display index — '01' … '07'. Matches the homepage bento. */
  num: string;
  /** URL segment under /services. Never change one without a redirect. */
  slug: string;
  /** Full title. Verbatim from expertise.doors. */
  title: string;
  /** Shortened for the nav dropdown, where the full title would wrap. */
  navLabel: string;
  /** One line under the nav label — what the craft actually does. */
  navBlurb: string;
  /** True → no page, no link. Rendered as inert "Coming soon" in the nav. */
  soon: boolean;
}

export const services: readonly Service[] = [
  {
    num: '01',
    slug: 'web-app-development',
    title: 'Web & App Development',
    navLabel: 'Web & App Development',
    navBlurb: 'Sites and apps built to convert.',
    soon: false,
  },
  {
    num: '02',
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    navLabel: 'Custom Software',
    navBlurb: 'Dashboards, integrations, automations.',
    soon: false,
  },
  {
    num: '03',
    slug: 'brand-strategy',
    title: 'Brand Strategy',
    navLabel: 'Brand Strategy',
    navBlurb: 'Positioning that pre-sells.',
    soon: false,
  },
  {
    num: '04',
    slug: 'seo',
    title: 'SEO',
    navLabel: 'SEO',
    navBlurb: 'Visibility that compounds.',
    soon: false,
  },
  {
    num: '05',
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    navLabel: 'Social Media Marketing',
    navBlurb: 'Content engines that earn trust.',
    soon: false,
  },
  {
    num: '06',
    slug: 'conversion-copywriting',
    title: 'Conversion Copywriting',
    navLabel: 'Conversion Copywriting',
    navBlurb: 'Words that close.',
    soon: true,
  },
  {
    num: '07',
    slug: 'ad-creatives',
    title: 'Ad Creatives',
    navLabel: 'Ad Creatives',
    navBlurb: 'Creative that earns the click.',
    soon: true,
  },
] as const;

/**
 * Slug → page copy, for every page that has been WRITTEN.
 *
 * `/services/[slug]` renders from here and 404s on a miss, the nav links only
 * these keys, and the sitemap lists only these keys. Adding a service page is
 * therefore one import and one line — and there is no second place to forget.
 */
export const pages: Readonly<Record<string, ServicePage>> = {
  [webAppDevelopment.slug]: webAppDevelopment,
};

/** True when the craft is sold AND its page exists — i.e. it is linkable. */
export function isLinkable(s: Service): boolean {
  return !s.soon && s.slug in pages;
}

/** In register order, so the nav, the sitemap and the pages agree. */
export const linkableServices = services.filter(isLinkable);

export function servicePage(slug: string): ServicePage | undefined {
  return pages[slug];
}

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
