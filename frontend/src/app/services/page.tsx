import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services & Pricing — WAHEED",
  description:
    "Transparent, fixed pricing for halal web development, social media marketing, and business coaching.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
