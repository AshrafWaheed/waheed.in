'use client';

/**
 * SmPackages — §6. Wide bars with the title set large.
 *
 * Fourth shape for the same job: cards (01), rows (03), ruled columns (04),
 * and here full-width bars that fill from the left on hover. It suits a
 * two-item set, which is what this craft honestly maps to — only the Authority
 * System and the Partnership contain ongoing social, and padding the row out
 * to three with a package that does not would be a lie told for symmetry.
 *
 * Read from `ladder.rungs`, never repeated into the service module, so a
 * package renamed on /packages cannot end up described differently here.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import { ladder } from '@/content/packages';
import type { ServicePage } from '@/content/services';

export default function SmPackages({ page }: { page: ServicePage }) {
  const rungs = page.packages
    .map((t) => ladder.rungs.find((r) => r.title === t))
    .filter((r): r is (typeof ladder.rungs)[number] => Boolean(r));

  if (rungs.length === 0) return null;

  return (
    <section className="sm-pack" data-section-color="light">
      <div className="cnt">
        <header className="sm-pack-head">
          <p className="sm-eyebrow">Where this sits</p>
          <h2 className="sm-h2 sm-h2--tight">
            <SplitReveal text="The packages that include it." by="word" />
          </h2>
        </header>

        <ul className="sm-pack-bars">
          {rungs.map((r) => (
            <li key={r.title}>
              <Link href="/packages" className="sm-pack-bar reveal" data-cursor>
                <span className="sm-pack-wash" aria-hidden="true" />
                <span className="sm-pack-in">
                  <span className="sm-pack-eyebrow">{r.eyebrow}</span>
                  <span className="sm-pack-t">{r.title}</span>
                  <span className="sm-pack-b">{r.subtitle}</span>
                </span>
                <span className="sm-pack-cue" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
