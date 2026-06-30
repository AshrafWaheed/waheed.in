import Hero         from '@/components/home/Hero';
import TrustStrip   from '@/components/home/TrustStrip';
import Expertise    from '@/components/home/Expertise';
import AudienceBand from '@/components/home/AudienceBand';
import Services     from '@/components/home/Services';
import Manifesto     from '@/components/home/Manifesto';
import IhsanProcess  from '@/components/home/IhsanProcess';
import RefusalPanel  from '@/components/home/RefusalPanel';
import Newsletter    from '@/components/home/Newsletter';
import FinalCTA      from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Expertise />
      <AudienceBand />
      <Services />
      <Manifesto />
      <IhsanProcess />
      <RefusalPanel />
      <Newsletter />
      <FinalCTA />
    </main>
  );
}
