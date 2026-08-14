/**
 * The default service journey — a scan-down page.
 *
 * dark → light → dark → light → dark → light → light → dark, with the two
 * adjacent light bands (packages, FAQ) separated by a hairline rather than a
 * colour flip. Used by any craft that has not been given a layout of its own in
 * the route's LAYOUTS map.
 *
 * A page that would be better served by a different journey should get its own
 * layout rather than a flag in here — see BrandStrategyLayout. Growing this file
 * conditionals-first is how eight sections become one component nobody can read.
 */
import ServiceHero from '@/components/service/ServiceHero';
import ServiceProblem from '@/components/service/ServiceProblem';
import ServiceBuild from '@/components/service/ServiceBuild';
import ServiceProcess from '@/components/service/ServiceProcess';
import ServiceOutcomes from '@/components/service/ServiceOutcomes';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceCta from '@/components/service/ServiceCta';
import type { ServiceLayoutProps } from './types';

export default function DefaultServiceLayout({ page, artifact }: ServiceLayoutProps) {
  return (
    <>
      <ServiceHero page={page} artifact={artifact} />
      <ServiceProblem page={page} />
      <ServiceBuild page={page} />
      <ServiceProcess page={page} />
      <ServiceOutcomes page={page} />
      <ServiceFaq page={page} />
      <ServiceCta page={page} />
    </>
  );
}
