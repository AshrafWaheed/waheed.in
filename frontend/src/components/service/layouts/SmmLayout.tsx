/**
 * Social Media Marketing's own journey.
 *
 * The same eight beats, performed as a thing that never stops:
 *
 *   §1 copy left, two columns of posts travelling past each other on the right —
 *      the only hero on the site still moving once it has arrived
 *   §2 three symptoms wiped in behind oversized outline numerals
 *   §3 the six parts as a horizontal accordion: one assembly, not six items
 *   §4 ninety days as a 13×5 grid filling in at the reader's scroll pace, the
 *      four phases sitting under the weeks they occupy
 *   §5 outcomes as bars that grow — a rhythm device, explicitly not a chart
 *   §6 packages as two full-width bars that wash in on hover
 *   §7 four questions with every answer already open
 *   §8 the close held between two marquees running opposite ways
 *
 * Colour: dark → light → dark → light → dark → light → light → dark, the same
 * banding the other layouts use. The rhythm is shared on purpose; it is the
 * only thing about these five pages that should be.
 */
import SmHero from '@/components/service/smm/SmHero';
import SmProblem from '@/components/service/smm/SmProblem';
import SmEngine from '@/components/service/smm/SmEngine';
import SmCadence from '@/components/service/smm/SmCadence';
import SmLift from '@/components/service/smm/SmLift';
import SmPackages from '@/components/service/smm/SmPackages';
import SmFaq from '@/components/service/smm/SmFaq';
import SmClose from '@/components/service/smm/SmClose';
import type { ServiceLayoutProps } from './types';

export default function SmmLayout({ page }: ServiceLayoutProps) {
  return (
    <>
      <SmHero page={page} />
      <SmProblem page={page} />
      <SmEngine page={page} />
      <SmCadence page={page} />
      <SmLift page={page} />
      <SmPackages page={page} />
      <SmFaq page={page} />
      <SmClose page={page} />
    </>
  );
}
