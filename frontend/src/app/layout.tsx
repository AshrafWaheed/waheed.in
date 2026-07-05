import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Amiri } from "next/font/google";
import ScrollProgress  from "@/components/ScrollProgress";
import ScrollReveal    from "@/components/ScrollReveal";
import Nav             from "@/components/Nav";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";
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
  title: "WAHEED — Halal Digital Studio",
  description:
    "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values. No shortcuts. No compromise.",
  metadataBase: new URL("https://waheed.in"),
  openGraph: {
    title: "WAHEED — Halal Digital Studio",
    description:
      "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values.",
    url: "https://waheed.in",
    siteName: "WAHEED",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${dmSans.variable} ${amiri.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <div className="scroll-progress" id="scrollProgress" />
        <ScrollProgress />
        <ScrollReveal />
        <Nav />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
