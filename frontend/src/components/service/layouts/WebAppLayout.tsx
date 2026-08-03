/**
 * 01 · Web & App Development.
 *
 * The default scan-down journey with ONE section swapped: the hero. Everything
 * below it is still the shared vocabulary, because those seven beats read fine
 * on this page and rebuilding them for the sake of difference is how you get a
 * second layout nobody can maintain.
 *
 * That is the layer this file exists for — a page that needs a different opening
 * but the same argument gets a layout with one import changed, rather than a
 * conditional inside DefaultServiceLayout.
 */
import WaHero from '@/components/service/webapp/WaHero';
import ServiceProblem from '@/components/service/ServiceProblem';
import ServiceBuild from '@/components/service/ServiceBuild';
import ServiceProcess from '@/components/service/ServiceProcess';
import ServiceOutcomes from '@/components/service/ServiceOutcomes';
import ServicePackages from '@/components/service/ServicePackages';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceCta from '@/components/service/ServiceCta';
import type { ServiceLayoutProps } from './types';

export default function WebAppLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <WaHero page={page} />
      <ServiceProblem page={page} />
      <ServiceBuild page={page} />
      <ServiceProcess page={page} />
      <ServiceOutcomes page={page} />
      <ServicePackages page={page} />
      <ServiceFaq page={page} />
      <ServiceCta page={page} />
    </>
  );
}
