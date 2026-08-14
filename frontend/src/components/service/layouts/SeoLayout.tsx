/**
 * SEO's own journey.
 *
 * The same eight beats every service page makes, performed as accumulation —
 * which is the only thing this craft is actually selling:
 *
 *   §1 copy stacked over a full-bleed paid-vs-organic curve, drawn on mount
 *   §2 a thesis lit word by word by scroll position, then three symptoms as
 *      cards that stack on each other
 *   §3 the six layers as slabs, each indented onto the one it rests on
 *   §4 twelve months as a literal staircase — the cards ARE the steps
 *   §5 outcomes as a checklist that ticks itself, refusals as full-width bands
 *   §6 packages as three columns divided by rules
 *   §7 questions as a two-up grid
 *   §8 the curve from §1, arriving at the button
 *
 * Colour: dark → light → dark → light → dark → light → light → dark. The two
 * dark bands in the middle carry the two sections that are structure (the stack)
 * and proof (the gains); the light ones carry the two that are time.
 */
import SoHero from '@/components/service/seo/SoHero';
import SoProblem from '@/components/service/seo/SoProblem';
import SoStack from '@/components/service/seo/SoStack';
import SoStairs from '@/components/service/seo/SoStairs';
import SoGains from '@/components/service/seo/SoGains';
import SoFaq from '@/components/service/seo/SoFaq';
import SoClose from '@/components/service/seo/SoClose';
import type { ServiceLayoutProps } from './types';

export default function SeoLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <SoHero page={page} />
      <SoProblem page={page} />
      <SoStack page={page} />
      <SoStairs page={page} />
      <SoGains page={page} />
      <SoFaq page={page} />
      <SoClose page={page} />
    </>
  );
}
