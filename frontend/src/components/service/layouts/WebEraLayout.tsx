/**
 * 01 · Web Development — the "eras" journey opening + the shared argument.
 *
 * Replaces WaHero with WebEraJourney: a pinned time machine that morphs one
 * brand through four eras of web design and lands on today's standard. That
 * landing IS the segue — the reader arrives in "now", and the same seven beats
 * every service page uses (problem → build → process → outcomes → packages →
 * FAQ → close) then explain how we actually build there. Only the opening is
 * bespoke; the rest stays shared, for the reason spelled out in WebAppLayout.
 */
import WebEraJourney from '@/components/service/webapp/WebEraJourney';
import ServiceProblem from '@/components/service/ServiceProblem';
import ServiceBuild from '@/components/service/ServiceBuild';
import ServiceProcess from '@/components/service/ServiceProcess';
import ServiceOutcomes from '@/components/service/ServiceOutcomes';
import ServicePackages from '@/components/service/ServicePackages';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceCta from '@/components/service/ServiceCta';
import type { ServiceLayoutProps } from './types';

export default function WebEraLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <WebEraJourney />
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
