import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Amiri, Jost } from "next/font/google";
import ScrollProgress  from "@/components/ScrollProgress";
import ScrollReveal    from "@/components/ScrollReveal";
import Nav             from "@/components/Nav";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";
import PreviewBanner   from "@/components/PreviewBanner";
import "./globals.css";

/**
 * Jost is now the ONLY Latin face on the site.
 *
 * Outcrowd runs one typeface at one weight for everything — h1 through h4, body,
 * links, buttons — with hierarchy carried by size alone (reference/outcrowd.io.md
 * §1.1, §3). Their face is ITC Avant Garde Gothic Std Md, a commercial Monotype
 * licence whose self-hosted files are not ours to lift; Jost is the Futura
 * revival the teardown picks as the closest free stand-in.
 *
 * No `weight` array: Jost is a variable font, so one file covers the whole range
 * (Next recommends this — see node_modules/next/dist/docs/.../font.md). Italic is
 * loaded not for our own design, which uses none, but so author `<em>` inside
 * `.blog-content` renders as a real italic rather than a synthesised oblique.
 *
 * Cormorant Garamond and DM Sans were removed here, not merely unhooked, so they
 * stop being downloaded. Restoring them is a re-add of two loaders plus the two
 * token lines in globals.css.
 */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Arabic has no Jost coverage, so Amiri stays — the only survivor of the old
 * stack, scoped to [lang="ar"] / .arabic in globals.css.
 *
 * Trimmed to arabic/400/normal as a direct consequence of the one-face rule.
 * It used to carry the latin subset, a 700 cut and italics because it sat in a
 * mixed stack; now Jost covers every latin glyph, nothing on the site is bold
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
      className={`${jost.variable} ${amiri.variable} h-full`}
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
