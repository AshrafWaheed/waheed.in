import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Amiri, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import ScrollProgress  from "@/components/ScrollProgress";
import ScrollReveal    from "@/components/ScrollReveal";
import Nav             from "@/components/Nav";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";
import PreviewBanner   from "@/components/PreviewBanner";
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

export const metadata: Metadata = {
  other: { 'man-site-verification': '4448e038432f15e8da67b866b4fb98b8' },
  title: "WAHEED · Halal Digital Studio",
  description:
    "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values. No shortcuts. No compromise.",
  metadataBase: new URL("https://waheed.in"),
  alternates: { canonical: "https://waheed.in" },
  openGraph: {
    title: "WAHEED · Halal Digital Studio",
    description:
      "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values.",
    url: "https://waheed.in",
    siteName: "WAHEED",
    locale: "en_GB",
    type: "website",
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

        {/* Google Analytics (gtag.js) — loads on all pages, incl. coming-soon */}
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

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xi6caj4oqk");
          `}
        </Script>
      </body>
    </html>
  );
}
