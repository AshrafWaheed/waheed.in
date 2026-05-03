import type { Metadata } from "next";
import HomepageV3 from "./HomepageV3";

export const metadata: Metadata = {
  title: "WAHEED — India's First Halal Digital Studio",
  description:
    "We help Muslim-led brands grow with integrity. Shariah-aligned web development, ethical marketing, and purpose-driven coaching. No shortcuts. No compromise.",
};

export default function HomePage() {
  return <HomepageV3 />;
}
