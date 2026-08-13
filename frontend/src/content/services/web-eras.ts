/**
 * Web Development — the "eras" journey copy.
 *
 * The web-development page opens on a scroll-scrubbed time machine
 * (components/service/webapp/WebEraJourney.tsx): one browser window morphing the
 * SAME Waheed brand through four eras of web design. This module holds the
 * NARRATION — the framing headline, and each era's year / name / window title /
 * address bar / one-line takeaway. The period pastiche INSIDE each mockup (the
 * fake "under construction" GIF, the Web 2.0 tag cloud, the flat-UI columns) is
 * decoration and lives in the component, aria-hidden, not here.
 *
 * These are visible strings, so they live in content/ like every other — but
 * they are page-specific illustration, not the shared ServicePage argument, so
 * they are their own module rather than a field on the shared type.
 */

export interface WebEra {
  /** Stable key + CSS suffix (we-era--90s …). */
  key: '90s' | '00s' | '10s' | 'now';
  /** Big HUD year. */
  year: string;
  /** Era name shown under the year. */
  tag: string;
  /** Browser window title-bar text for this era. */
  os: string;
  /** Address-bar text for this era. */
  url: string;
  /** One-line takeaway under the browser. */
  caption: string;
}

export const webJourney = {
  eyebrow: 'Web Development',
  h1: { lead: 'The web reinvented itself', em: 'four times.' },
  sub:
    'Watch one brand travel thirty years of web design — from table layouts and hit ' +
    'counters to the standard we build to today. Same name. Four very different websites.',
  cue: 'Scroll to time-travel',
  outro: {
    lead: 'Most brands are still stuck in an era that stopped paying them back.',
    body:
      'We build in the one you just landed in — fast, accessible, conversion-mapped, and ' +
      'owned by you. Here is exactly what that looks like.',
  },
} as const;

export const webEras: readonly WebEra[] = [
  {
    key: '90s',
    year: '1996',
    tag: 'The Table Era',
    os: "Waheed's Home Page — Netscape",
    url: 'http://www.waheed.in/index.htm',
    caption: 'Tables, <marquee>, and a hit counter. It loaded. Barely.',
  },
  {
    key: '00s',
    year: '2004',
    tag: 'Web 2.0',
    os: 'waheed.in :: Now with RSS!',
    url: 'http://www.waheed.in',
    caption: 'Glossy buttons, wet-floor reflections, and a permanent “beta” badge.',
  },
  {
    key: '10s',
    year: '2012',
    tag: 'Flat & Responsive',
    os: 'Waheed',
    url: 'https://waheed.in',
    caption: 'Flat, full-width, and — finally — readable on a phone.',
  },
  {
    key: 'now',
    year: 'Today',
    tag: 'The Standard',
    os: 'waheed.in',
    url: 'waheed.in',
    caption: 'Fast, accessible, conversion-mapped — and owned by you.',
  },
] as const;
