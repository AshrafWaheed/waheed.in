import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroBarakahCore from '@/components/home/tactile/HeroBarakahCore';
import TrustStripTactile from '@/components/home/tactile/TrustStripTactile';
import ManifestoTactile from '@/components/home/tactile/ManifestoTactile';
import ExpertiseTactile from '@/components/home/tactile/ExpertiseTactile';
import IhsanProcessTactile from '@/components/home/tactile/IhsanProcessTactile';
import RefusalTactile from '@/components/home/tactile/RefusalTactile';
// Audience (hover-expand), Services (spotlight/magnetic), Newsletter & FinalCTA
// (explode/magnetic) are already tactile — reused from the Hybrid set.
import AudienceHybrid from '@/components/home/hybrid/AudienceHybrid';
import ServicesHybrid from '@/components/home/hybrid/ServicesHybrid';
import NewsletterHybrid from '@/components/home/hybrid/NewsletterHybrid';
import FinalCtaHybrid from '@/components/home/hybrid/FinalCtaHybrid';

// Outcrowd-tactile variant — full page.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home3Page() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroBarakahCore />
        <TrustStripTactile />
        <ManifestoTactile />
        <ExpertiseTactile />
        <AudienceHybrid />
        <ServicesHybrid />
        <IhsanProcessTactile />
        <RefusalTactile />
        <NewsletterHybrid />
        <FinalCtaHybrid />
      </main>
    </SmoothScroll>
  );
}
