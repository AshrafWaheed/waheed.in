import Nav              from "@/components/layout/Nav";
import Hero             from "@/components/sections/Hero";
import TrustStrip       from "@/components/sections/TrustStrip";
import FeaturedServices from "@/components/sections/FeaturedServices";
import WhatWeDo         from "@/components/sections/WhatWeDo";
import ManifestoBand    from "@/components/sections/ManifestoBand";
import HowItWorks       from "@/components/sections/HowItWorks";
import CaseStudies      from "@/components/sections/CaseStudies";
import Testimonials     from "@/components/sections/Testimonials";
import BlogPreview      from "@/components/sections/BlogPreview";
import Newsletter       from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <main className="bg-[var(--cream)]">
      <Nav />
      <Hero />
      <TrustStrip />
      <FeaturedServices />
      <WhatWeDo />
      <ManifestoBand />
      <HowItWorks />
      <CaseStudies />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
    </main>
  );
}
