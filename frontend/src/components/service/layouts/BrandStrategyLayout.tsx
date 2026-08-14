/**
 * Brand Strategy's own journey.
 *
 * Same eight beats as the default layout — every service page has to make the
 * same argument — but not one of them is the same object, because a page about
 * differentiation that looked identical to the page before it would be losing
 * its own argument on sight.
 *
 *   §1 centred inside a field of forty identical marks, one of which resolves
 *   §2 a pinned illustration re-drawing itself as three symptoms scroll past
 *   §3 the six artefacts travelling sideways through a pinned rail
 *   §4 four phases alternating across a spine drawn by scroll position
 *   §5 outcomes as five before/after swaps that perform the swap
 *   §6 the packages as rows, not a third grid
 *   §7 numbered full-measure questions, mark leading
 *   §8 a left-aligned close under one full-measure rule
 *
 * Colour runs dark → dark → light → dark → light → light → light → dark: two
 * dark bands open the page because §1 and §2 are one continuous thought (the
 * market, then why you are lost in it), and the first light band lands exactly
 * where the page stops diagnosing and starts delivering.
 */
import BsHero from '@/components/service/brand/BsHero';
import BsDiagnosis from '@/components/service/brand/BsDiagnosis';
import BsRail from '@/components/service/brand/BsRail';
import BsSpine from '@/components/service/brand/BsSpine';
import BsShift from '@/components/service/brand/BsShift';
import BsFaq from '@/components/service/brand/BsFaq';
import BsClose from '@/components/service/brand/BsClose';
import type { ServiceLayoutProps } from './types';

export default function BrandStrategyLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <BsHero page={page} />
      <BsDiagnosis page={page} />
      <BsRail page={page} />
      <BsSpine page={page} />
      <BsShift page={page} />
      <BsFaq page={page} />
      <BsClose page={page} />
    </>
  );
}
