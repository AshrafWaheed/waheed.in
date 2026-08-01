'use client';

/**
 * SoPackages — §6. Three columns divided by rules, no card chrome at all.
 *
 * Third shape for the same job: page 01 uses cards, page 03 uses rows, this one
 * uses columns separated by hairlines. Same rule as both of those — the copy is
 * read from `ladder.rungs`, never repeated into the service module, so a package
 * renamed on /packages cannot end up described differently here.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import { ladder } from '@/content/packages';
import type { ServicePage } from '@/content/services';

export default function SoPackages({ page }: { page: ServicePage }) {
  const rungs = page.packages
    .map((t) => ladder.rungs.find((r) => r.title === t))
    .filter((r): r is (typeof ladder.rungs)[number] => Boolean(r));

  if (rungs.length === 0) return null;

  return (
    <section className="so-pack" data-section-color="light">
      <div className="cnt">
        <header className="so-pack-head">
          <p className="so-eyebrow">Where this sits</p>
          <h2 className="so-h2 so-h2--tight">
            <SplitReveal text="The packages that include it." by="word" />
          </h2>
        </header>

        <div className="so-pack-cols">
          {rungs.map((r) => (
            <Link key={r.title} href="/packages" className="so-pack-col reveal" data-cursor>
              <span className="so-pack-eyebrow">{r.eyebrow}</span>
              <span className="so-pack-t">{r.title}</span>
              <span className="so-pack-b">{r.subtitle}</span>
              <span className="so-pack-cue">See what&rsquo;s inside →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
