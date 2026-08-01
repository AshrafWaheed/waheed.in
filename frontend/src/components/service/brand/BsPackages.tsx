'use client';

/**
 * BsPackages — §6. The funnel back to the money page, as rows rather than cards.
 *
 * Same job as the default layout's card grid, deliberately not the same object:
 * three cards would be the third grid on this page. Rows read as a list you
 * scan down and step into, and they let the package descriptions differ in
 * length without the equal-height problem cards have.
 *
 * Built from `ladder.rungs`, not from copy repeated into the service module, so
 * a package renamed on /packages cannot end up described differently here. A
 * title matching nothing is dropped — a missing row is visible and fixable; a
 * row with invented copy is not.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import { ladder } from '@/content/packages';
import type { ServicePage } from '@/content/services';

export default function BsPackages({ page }: { page: ServicePage }) {
  const rungs = page.packages
    .map((t) => ladder.rungs.find((r) => r.title === t))
    .filter((r): r is (typeof ladder.rungs)[number] => Boolean(r));

  if (rungs.length === 0) return null;

  return (
    <section className="bs-pack" data-section-color="light">
      <div className="cnt">
        <header className="bs-pack-head">
          <p className="bs-eyebrow">Where this sits</p>
          <h2 className="bs-h2 bs-h2--tight">
            <SplitReveal text="The packages that include it." by="word" />
          </h2>
        </header>

        <ul className="bs-pack-rows">
          {rungs.map((r) => (
            <li key={r.title}>
              <Link href="/packages" className="bs-pack-row reveal" data-cursor>
                <span className="bs-pack-eyebrow">{r.eyebrow}</span>
                <span className="bs-pack-t">{r.title}</span>
                <span className="bs-pack-b">{r.subtitle}</span>
                <span className="bs-pack-cue" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
