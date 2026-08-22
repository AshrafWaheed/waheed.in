import type { Metadata } from "next";
import Script from "next/script";
import { cookies, headers } from "next/headers";
import { Amiri, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import ScrollProgress  from "@/components/ScrollProgress";
import ScrollReveal    from "@/components/ScrollReveal";
import Nav             from "@/components/Nav";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";
import PreviewBanner   from "@/components/PreviewBanner";
import CookieConsent    from "@/components/consent/CookieConsent";
import { CONSENT_COOKIE, CONSENT_VERSION, parseConsent } from "@/lib/consent";
import "./globals.css";

/**
 * Space Grotesk is the ONLY Latin TEXT face — display and body both.
 *
 * That keeps the one-typeface / one-weight rule the design was built on
 * (reference/outcrowd.io.md §1.1, §3): hierarchy from SIZE alone, never from
 * face or weight. Jost held the slot originally, then Fredoka; Space Grotesk
 * has enough character to carry a 3.6rem hero — the single-storey `g`, the wide
 * apertures — while staying clean at the .85rem body size, which is the
 * requirement that rules out most faces with real personality.
 *
 * No `weight` array: variable font, one file covers the range.
 */
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/**
 * JetBrains Mono is the LABEL TIER, and nothing else.
 *
 * What reads as "technical" on a page is not the headline face, it is the small
 * letterspaced uppercase: eyebrows, badges, the tier HUDs, the craft artifacts'
 * chrome, ORGANIC · DIRECT · REFERRAL, form labels. There are ~47 such rules
 * here and none runs longer than four words, so a monospace costs nothing in
 * reading speed and buys the whole signal.
 *
 * It is deliberately a second TIER, not a second VOICE — it never touches a
 * sentence, a heading or a button. That is what keeps the one-face rule above
 * honest rather than quietly broken. Applied through --font-mono in
 * globals.css; new labels should reference that token, not the family.
 */
const mono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Arabic has no Space Grotesk coverage, so Amiri stays — the only survivor of the old
 * stack, scoped to [lang="ar"] / .arabic in globals.css.
 *
 * Trimmed to arabic/400/normal as a direct consequence of the one-face rule.
 * It used to carry the latin subset, a 700 cut and italics because it sat in a
 * mixed stack; now Space Grotesk covers every latin glyph, nothing on the site is bold
 * and nothing is italic, so those seven extra files were pure dead weight —
 * they were most of a 563 KB font payload for a handful of Arabic words.
 * Note the 700 cut was already unreachable: body sets weight 500, and CSS font
 * matching resolves 500 against a 400/700 family down to 400.
 */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

/**
 * ROOT metadata — the homepage's own, and the fallback for anything that does
 * not override it.
 *
 * A page that sets nothing inherits ALL of this, canonical included, which is
 * why every public route either calls `pageMeta` (src/lib/seo.ts) or, when its
 * page is a client component and cannot export metadata, carries a layout that
 * does — see src/app/contact/layout.tsx for the one case of that.
 *
 * The card image is not declared here: `opengraph-image.jpg` and
 * `twitter-image.jpg` sit beside this file, and Next resolves them by
 * convention into og:image / twitter:image with the right dimensions and the
 * alt text from the matching .alt.txt. See design/og/og-card.html.
 */
export const metadata: Metadata = {
  title: "WAHEED · Halal Tech & Marketing Agency",
  description:
    "A halal tech and marketing agency for Muslim-led brands. Websites, apps, custom software, integrations, SEO and social, built on Shariah-aligned values.",
  metadataBase: new URL("https://waheed.in"),
  alternates: {
    canonical: "https://waheed.in",
    types: {
      'application/rss+xml': [{ url: 'https://waheed.in/blog/rss.xml', title: 'WAHEED · Insights' }],
    },
  },
  openGraph: {
    title: "WAHEED · Halal Tech & Marketing Agency",
    description:
      "We help Muslim-led brands grow with integrity. Websites, apps, custom software, integrations, SEO and social, built on Shariah-aligned values.",
    url: "https://waheed.in",
    siteName: "WAHEED",
    locale: "en_GB",
    type: "website",
  },
  /*
   * `summary_large_image` is stated rather than left to inference. With no
   * twitter block at all Next emitted `twitter:card content="summary"`, which
   * is the 1:1 thumbnail card — a 1200x630 image shown as a small square with
   * the sides cropped off, i.e. the headline gone.
   */
  twitter: { card: 'summary_large_image' },
  /*
   * `max-image-preview: large` is the one that earns its place: without it
   * Google shows a thumbnail-sized image (or none) beside a result, and it is
   * also the gate on Discover eligibility. The snippet/video values are the
   * documented "no limit" sentinels.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The proxy stamps these headers: site chrome + (admin) preview banner.
  // See src/proxy.ts. Reading headers keeps every page rendered at request time,
  // so the same URL can be the coming-soon screen (public) or the real page (admin).
  const h = await headers();
  const showChrome = h.get("x-waheed-chrome") === "1";
  const previewMode = h.get("x-waheed-preview"); // '' | 'coming-soon' | 'maintenance'
  const showPreview = previewMode === "coming-soon" || previewMode === "maintenance";
  // The blog is only public once the site is fully live (chrome + not a preview).
  const blogPublic = showChrome && !showPreview;

  /*
   * ── The consent gate ─────────────────────────────────────────────────────
   *
   * ePrivacy Art 5(3) wants consent BEFORE anything non-essential touches the
   * device, so the gate is here, in the server render, rather than in a client
   * "consent mode" that loads the vendor script and then asks it to behave. If
   * the cookie does not permit a purpose, that purpose's <Script> is simply not
   * in the HTML: no request, no vendor-side sighting of the IP, nothing to
   * audit. It also means the trackers cannot be re-enabled by a bug in client
   * code, because there is no client code holding them back.
   *
   * `Sec-GPC: 1` is Global Privacy Control, a browser-level "do not sell or
   * share" signal. Treating it as a refusal is both the intent of the spec and
   * the honest reading of an Art 21 objection, so a visitor sending it is never
   * shown the banner at all — being asked again after you have already answered
   * at the browser level is the nagging the rule exists to stop. An explicit
   * choice stored later still wins over the signal, which is why `stored` is
   * checked first: opting in deliberately has to remain possible.
   *
   * This whole layout is already request-time (it reads headers()), so reading
   * cookies() costs no additional dynamism.
   */
  const trackable = h.get("x-waheed-track") === "1";
  const stored = parseConsent((await cookies()).get(CONSENT_COOKIE)?.value);
  const gpc = h.get("sec-gpc") === "1";
  const consent = stored ?? (gpc ? { version: CONSENT_VERSION, analytics: false, at: 0 } : null);

  const allowAnalytics = trackable && consent?.analytics === true;

  return (
    <html
      lang="en-GB"
      className={`${grotesk.variable} ${mono.variable} ${amiri.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {showChrome ? (
          <>
            <div className="scroll-progress" id="scrollProgress" />
            <ScrollProgress />
            <ScrollReveal />
            <Nav blogPublic={blogPublic} />
            {children}
            <Footer blogPublic={blogPublic} />
            <WhatsAppFloat />
          </>
        ) : (
          children
        )}

        {showPreview && <PreviewBanner mode={previewMode as 'coming-soon' | 'maintenance'} />}

        {/*
         * Umami — our own analytics, on our own server, ungated on purpose.
         *
         * This is NOT an oversight and NOT a "strictly necessary" fudge. The
         * consent requirement in ePrivacy Art 5(3) attaches to storing or
         * reading something on the visitor's device. This tracker does neither:
         * it sets no cookie and writes nothing to browser storage, so there is
         * nothing to ask permission for. Visits are grouped by a hash of IP +
         * user-agent whose salt rotates DAILY (SALT_ROTATION=day in
         * /var/www/umami/app/.env, deliberately not the shipped default of
         * 'month'), so the hash cannot link a person across days.
         *
         * `data-do-not-track` makes it skip anyone sending DNT, matching how
         * Sec-GPC is honoured above. `data-domains` means our website id is
         * inert if the script is ever loaded from somewhere else.
         *
         * Served first-party from /stats, so no third party sees the request.
         * It is 2.3 KB gzipped against gtag.js's 186 KB.
         */}
        {trackable && (
          <Script
            src="/stats/script.js"
            data-website-id="bb66f26e-2fa0-4362-b8cf-9e92fb7ec4a6"
            data-do-not-track="true"
            data-domains="waheed.in,www.waheed.in"
            strategy="afterInteractive"
          />
        )}

        {trackable && <CookieConsent consent={consent} />}

        {/*
         * Everything below is gated on consent. Both vendors answer the same
         * question — how many people, which pages — so they share one purpose.
         *
         * Microsoft Clarity used to sit here as a second, separate purpose.
         * It was session recording: it captured pointer movement, clicks,
         * scrolling and page layout as a replayable video. It was removed on
         * 2026-08-22 by the owner's decision, which is why there is now only
         * one switch. If anything of that shape is ever added back, it needs
         * its own purpose again rather than being folded in here — consent has
         * to be specific, and "count me" is not "film me".
         */}

        {/* Google Analytics (gtag.js) */}
        {allowAnalytics && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-JWK6HQKXGY"
              strategy="afterInteractive"
            />
            <Script id="ga-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-JWK6HQKXGY');
              `}
            </Script>
          </>
        )}

        {/*
         * Ahrefs runs on `lazyOnload` (after window.load) rather than
         * `afterInteractive` (during hydration): it is a pageview beacon and
         * nothing waits on it.
         *
         * GA deliberately stays on `afterInteractive`. It is the one whose
         * count has to be right, and lazyOnload would drop every visitor who
         * leaves before window.load fires.
         */}
        {/* Ahrefs Web Analytics */}
        {allowAnalytics && (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="KkmkaCew/+aq5rYTtzftCQ"
            strategy="lazyOnload"
          />
        )}

      </body>
    </html>
  );
}
