import Hero         from '@/components/home/Hero';
import TrustStrip   from '@/components/home/TrustStrip';
import Expertise    from '@/components/home/Expertise';
import AudienceBand from '@/components/home/AudienceBand';
import Services     from '@/components/home/Services';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Expertise />
      <AudienceBand />
      <Services />
    </main>
  );
}
