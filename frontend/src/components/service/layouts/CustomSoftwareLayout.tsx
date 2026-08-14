/**
 * Custom Software Development's own journey — a "system online" environment.
 *
 * The narrative core is rebuilt bespoke in the `cs-` design language (a
 * blueprint-grid dark field, mono HUD labels, gold-lit panels): the SoftwareRig
 * hero, console-style diagnostics, a module grid, a spec pipeline and a system
 * readout. The transactional tail (packages, FAQ, close) reuses the shared
 * service sections — they are the same on every service page by design.
 */
import CsHero from '@/components/service/custom/CsHero';
import CsProblem from '@/components/service/custom/CsProblem';
import CsBuild from '@/components/service/custom/CsBuild';
import CsProcess from '@/components/service/custom/CsProcess';
import CsOutcomes from '@/components/service/custom/CsOutcomes';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceCta from '@/components/service/ServiceCta';
import type { ServiceLayoutProps } from './types';

export default function CustomSoftwareLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <CsHero page={page} />
      <CsProblem page={page} />
      <CsBuild page={page} />
      <CsProcess page={page} />
      <CsOutcomes page={page} />
      <ServiceFaq page={page} />
      <ServiceCta page={page} />
    </>
  );
}
