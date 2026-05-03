import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import HomeHero from "@/components/home/HomeHero";
import HomeMarquee from "@/components/home/HomeMarquee";
import HomePhilosophy from "@/components/home/HomePhilosophy";
import HomeServices from "@/components/home/HomeServices";
import HomeManifesto from "@/components/home/HomeManifesto";
import HomeProcess from "@/components/home/HomeProcess";
import HomeWork from "@/components/home/HomeWork";
import HomeTestimonial from "@/components/home/HomeTestimonial";
import HomeBlog from "@/components/home/HomeBlog";
import HomeNewsletter from "@/components/home/HomeNewsletter";

export const metadata: Metadata = {
  title: "WAHEED — India's First Halal Digital Studio",
  description: "We help Muslim-led brands grow with integrity. Shariah-aligned web development, ethical marketing, and purpose-driven coaching. No shortcuts. No compromise.",
};

export default function HomePage() {
  return (
    <main>
      <HomeNav />
      <HomeHero />
      <HomeMarquee />
      <HomePhilosophy />
      <HomeServices />
      <HomeManifesto />
      <HomeProcess />
      <HomeWork />
      <HomeTestimonial />
      <HomeBlog />
      <HomeNewsletter />
    </main>
  );
}
