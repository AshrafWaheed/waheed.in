import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Amiri } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WAHEED — India's First Halal Digital Studio",
  description:
    "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values. No shortcuts. No compromise.",
  metadataBase: new URL("https://waheed.in"),
  openGraph: {
    title: "WAHEED — India's First Halal Digital Studio",
    description:
      "We help Muslim-led brands grow with integrity. Strategy, design, and digital products built on Shariah-aligned values.",
    url: "https://waheed.in",
    siteName: "WAHEED",
    locale: "en_IN",
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
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${amiri.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
