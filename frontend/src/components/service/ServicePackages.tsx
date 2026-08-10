'use client';

/**
 * ServicePackages — §6. The funnel back to the money page.
 *
 * A service page explains a craft; it does not have a price. Left alone it
 * dead-ends, so this section names the /packages rungs that CONTAIN this craft
 * and sends the reader there.
 *
 * The cards are built from `ladder.rungs` rather than from copy repeated into
 * the service module, so a package renamed on /packages cannot end up described
 * differently here. A title that matches nothing is dropped — a missing card is
 * a visible, fixable mistake; a card with invented copy is not.
 */
import Link from 'next/link';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import { ladder } from '@/content/packages';
import type { ServicePage } from '@/content/services';

export default function ServicePackages({ page }: { page: ServicePage }) {
  const rungs = page.packages
    .map((t) => ladder.rungs.find((r) => r.title === t))
    .filter((r): r is (typeof ladder.rungs)[number] => Boolean(r));

  if (rungs.length === 0) return null;

  return (
    <section className="sd-pack" data-section-color="light">
      <div className="cnt">
        <header className="sd-head">
          <h2 className="sd-h2">
            <SplitReveal text="The packages that include it." by="word" />
          </h2>
        </header>

        <div className="sd-pack-grid">
          {rungs.map((r) => (
            <Spotlight key={r.title} className="sd-pack-card reveal">
              <Link href="/packages" className="sd-pack-link" data-cursor>
                <h3 className="sd-pack-t">{r.title}</h3>
                <p className="sd-pack-b">{r.subtitle}</p>
                <span className="sd-pack-cue">See what&rsquo;s inside →</span>
              </Link>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
