/**
 * Cookie consent — the single source of truth for what may load, and when.
 *
 * ── Why this is a server-side gate and not a client-side "consent mode" ─────
 *
 * ePrivacy Art 5(3) requires consent BEFORE anything non-essential is stored on
 * or read from the visitor's device. The common implementation loads gtag.js
 * immediately and then tells it not to set cookies until consent arrives. That
 * is a weaker thing than it looks: the script is fetched, the vendor sees the
 * request and the IP, and the whole arrangement depends on a third party
 * honouring a flag we cannot audit.
 *
 * So the gate here is in the root layout instead. The <Script> tags are simply
 * not rendered until the cookie says they may be, which means the trackers are
 * absent from the HTML rather than present-but-asked-nicely. That is why this
 * module has to be importable from a Server Component: no 'use client', no
 * browser globals at module scope.
 *
 * ── The cookie ─────────────────────────────────────────────────────────────
 *
 * `waheed_consent`, value `version.analytics.recording.unixSeconds`, e.g.
 * `1.1.0.1755823200`. Deliberately not JSON: it rides in a cookie, and a format
 * with no quotes, braces or `=` cannot be mangled by an intermediary or trip a
 * strict cookie parser. It carries no identifier and no personal data — it
 * records a preference, which is why the cookie itself needs no consent.
 *
 * Nothing signs it. A visitor who forges it only changes what runs in their own
 * browser, which they can do anyway with an extension, so a signature would buy
 * nothing and would tie a public page to APP_PREVIEW_SECRET.
 */

export const CONSENT_COOKIE = 'waheed_consent';

/**
 * Bump this when the SET OF PURPOSES OR VENDORS changes.
 *
 * Consent is specific to what was disclosed at the time it was given, so
 * consent to "GA4 and Clarity" is not consent to a tracker added afterwards.
 * A version mismatch parses as "no decision", which puts the banner back and
 * asks again. That is the intended cost of adding a tracker.
 */
export const CONSENT_VERSION = 1;

/**
 * 180 days. The CNIL's guidance is that a choice should not be remembered
 * beyond roughly six months before being asked again; the cookie's own Max-Age
 * is the enforcement, so an expired choice simply reads as no choice.
 */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

/** Fired on `window` to reopen the preferences panel from anywhere. */
export const CONSENT_EVENT = 'waheed:cookie-settings';

export type Purpose = 'analytics' | 'recording';

export type Consent = {
  version: number;
  analytics: boolean;
  recording: boolean;
  /** Unix seconds. Kept so a visitor can be told when they chose. */
  at: number;
};

/** All-off. What an undecided visitor gets, and what a GPC signal resolves to. */
export const DENY_ALL: Omit<Consent, 'version' | 'at'> = {
  analytics: false,
  recording: false,
};

/**
 * Read a stored decision. Returns null for "no valid decision", which is what
 * puts the banner on screen — anything malformed, from another version, or
 * simply absent lands in the same place, and that place is the safe one.
 */
export function parseConsent(raw?: string | null): Consent | null {
  if (!raw) return null;

  const parts = raw.split('.');
  if (parts.length !== 4) return null;

  const [version, analytics, recording, at] = parts.map((n) => Number.parseInt(n, 10));

  if (version !== CONSENT_VERSION) return null;
  if (!Number.isFinite(at) || at <= 0) return null;
  if (analytics !== 0 && analytics !== 1) return null;
  if (recording !== 0 && recording !== 1) return null;

  return { version, analytics: analytics === 1, recording: recording === 1, at };
}

export function serializeConsent(c: Omit<Consent, 'version' | 'at'>): string {
  const at = Math.floor(Date.now() / 1000);
  return `${CONSENT_VERSION}.${c.analytics ? 1 : 0}.${c.recording ? 1 : 0}.${at}`;
}

// ── The register ────────────────────────────────────────────────────────────
//
// One description of every purpose, vendor and cookie, used by three places at
// once: the toggles in the preferences panel, the table on /cookies, and the
// list of cookies to delete when consent is withdrawn. They are the same facts,
// so they are written once. A cookie table that has drifted from what the site
// actually sets is the ordinary way these pages become false.

export type CookieRow = {
  name: string;
  /** Third-party cookies live on a vendor's domain, so WE cannot delete them. */
  party: 'first' | 'third';
  domain: string;
  ttl: string;
  purpose: string;
};

export type Vendor = {
  name: string;
  role: string;
  /** Where the data goes, in plain words. */
  transfer: string;
  policy: string;
};

export type PurposeSpec = {
  id: 'essential' | Purpose;
  title: string;
  /** One line, sits next to the toggle. */
  summary: string;
  /** What actually happens if this is on. Written to be read, not skimmed. */
  detail: string;
  /** Essential is on and cannot be turned off; it needs no consent. */
  locked?: true;
  vendors: Vendor[];
  cookies: CookieRow[];
};

export const PURPOSES: PurposeSpec[] = [
  {
    id: 'essential',
    title: 'Strictly necessary',
    summary: 'Needed for the site to work. Always on.',
    detail:
      'These remember the choice you make below, and keep an administrator signed in to the ' +
      'private part of this site. They set no identifier that follows you anywhere, they are ' +
      'never read by anyone but us, and the site cannot honour your cookie choice without them. ' +
      'Under the ePrivacy rules these are exempt from consent, which is why there is no switch.',
    locked: true,
    vendors: [],
    cookies: [
      {
        name: 'waheed_consent',
        party: 'first',
        domain: 'waheed.in',
        ttl: '180 days',
        purpose: 'Stores the choice you make on this page so you are not asked again on every visit.',
      },
      {
        name: 'waheed_admin',
        party: 'first',
        domain: 'waheed.in',
        ttl: '7 days',
        purpose:
          'Only ever set for a signed-in administrator of this site. Never set for a visitor.',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Audience measurement',
    summary: 'How many people visit, which pages they read, and where they arrived from.',
    detail:
      'Counts visits and page views so we can see which articles are worth writing more of. ' +
      'Google Analytics gives you a randomly generated ID that lets it recognise the same ' +
      'browser returning later. Ahrefs states that it sets no cookies and collects no personal ' +
      'data; it is grouped here anyway, because loading any third-party script sends your IP ' +
      'address to that third party, and that is your decision to make rather than ours.',
    vendors: [
      {
        name: 'Google Analytics 4',
        role: 'Counts visits and page views, and reports them to us in aggregate.',
        transfer:
          'Google Ireland Limited, with onward transfer to Google LLC in the United States ' +
          'under the EU-US Data Privacy Framework and Standard Contractual Clauses.',
        policy: 'https://policies.google.com/privacy',
      },
      {
        name: 'Ahrefs Web Analytics',
        role: 'A second, lighter page-view count used as a sanity check on the first.',
        transfer: 'Ahrefs Pte Ltd, Singapore.',
        policy: 'https://ahrefs.com/privacy',
      },
    ],
    cookies: [
      {
        name: '_ga',
        party: 'first',
        domain: 'waheed.in',
        ttl: '2 years',
        purpose: 'A random ID that lets Google Analytics tell one browser from another.',
      },
      {
        name: '_ga_JWK6HQKXGY',
        party: 'first',
        domain: 'waheed.in',
        ttl: '2 years',
        purpose: 'Keeps the state of a single visit for this specific Analytics property.',
      },
    ],
  },
  {
    id: 'recording',
    title: 'Session recording',
    summary: 'Records your mouse, clicks and scrolling on the page so we can watch it back.',
    detail:
      'This is the intrusive one, and it is separate from the count above so you can refuse it ' +
      'on its own. Microsoft Clarity records what you do on the page: where the pointer moves, ' +
      'what you click, how far you scroll, and the layout of the page as you saw it. We watch ' +
      'those recordings back to find the places where the site is confusing. Clarity masks form ' +
      'fields and text by default, but we would rather you decided knowing what it is than ' +
      'knowing what it is called.',
    vendors: [
      {
        name: 'Microsoft Clarity',
        role: 'Records and replays individual visits, and builds heatmaps from them.',
        transfer:
          'Microsoft Ireland Operations Limited, with onward transfer to Microsoft Corporation ' +
          'in the United States under the EU-US Data Privacy Framework.',
        policy: 'https://privacy.microsoft.com/privacystatement',
      },
    ],
    cookies: [
      {
        name: '_clck',
        party: 'first',
        domain: 'waheed.in',
        ttl: '1 year',
        purpose: 'Ties the recordings of your separate visits together as one browser.',
      },
      {
        name: '_clsk',
        party: 'first',
        domain: 'waheed.in',
        ttl: '1 day',
        purpose: 'Joins the page views within a single visit into one replayable session.',
      },
      {
        name: 'MUID, CLID, SM, ANONCHK',
        party: 'third',
        domain: '.clarity.ms, .c.clarity.ms, .bing.com',
        ttl: 'Up to 13 months',
        purpose:
          'Set by Microsoft on its own domains. We can stop sending you to Microsoft, but we ' +
          'cannot delete a cookie on a domain that is not ours. Use the Microsoft link below.',
      },
    ],
  },
];

/** The purposes a visitor can actually switch, in the order they are shown. */
export const OPTIONAL_PURPOSES = PURPOSES.filter(
  (p): p is PurposeSpec & { id: Purpose } => !p.locked,
);

/**
 * First-party cookie names to delete when a purpose is switched off.
 *
 * Derived from the register rather than written out again, so a tracker added
 * to the table above is automatically one we clean up. Third-party rows are
 * excluded because `document.cookie` cannot touch another domain — pretending
 * otherwise in the UI would be the same kind of false claim this whole change
 * exists to remove.
 */
export function firstPartyCookies(purpose: Purpose): string[] {
  const spec = PURPOSES.find((p) => p.id === purpose);
  if (!spec) return [];
  return spec.cookies.filter((c) => c.party === 'first').map((c) => c.name);
}
