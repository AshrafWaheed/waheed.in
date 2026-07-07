import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Cormorant_Garamond, DM_Sans, Amiri } from "next/font/google";
import ScrollProgress  from "@/components/ScrollProgress";
import ScrollReveal    from "@/components/ScrollReveal";
import Nav             from "@/components/Nav";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";
import PreviewBanner   from "@/components/PreviewBanner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  other: { 'man-site-verification': '4448e038432f15e8da67b866b4fb98b8' },
  title: "WAHEED · Halal Digital Studio",
  description:
    "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values. No shortcuts. No compromise.",
  metadataBase: new URL("https://waheed.in"),
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
  const showPreview = h.get("x-waheed-preview") === "1";

  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${dmSans.variable} ${amiri.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {showChrome ? (
          <>
            <div className="scroll-progress" id="scrollProgress" />
            <ScrollProgress />
            <ScrollReveal />
            <Nav />
            {children}
            <Footer />
            <WhatsAppFloat />
          </>
        ) : (
          children
        )}

        {showPreview && <PreviewBanner />}

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
