'use client';

/**
 * ServiceBuild — §3. The six deliverables.
 *
 * This is the section that has to answer "what am I actually paying for", so it
 * is the one place on the page that uses a plain grid: six comparable objects,
 * scanned rather than read, is exactly the shape a grid is for.
 *
 * On night, with Spotlight per cell — the same cursor-glow the bento and the
 * offer ladder use, which is what keeps a six-up grid from reading as inert.
 */
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

export default function ServiceBuild({ page }: { page: ServicePage }) {
  const { heading, sub, items } = page.build;

  return (
    <section className="sd-build" data-section-color="dark">
      <div className="cnt">
        <header className="sd-head">
          <h2 className="sd-h2 sd-h2--on-night">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="sd-lede sd-lede--on-night reveal">{sub}</p>
        </header>

        <div className="sd-deliv">
          {items.map((it) => (
            <Spotlight key={it.num} className="sd-deliv-cell reveal">
              <span className="sd-deliv-num">{it.num}</span>
              <h3 className="sd-deliv-t">{it.title}</h3>
              <p className="sd-deliv-b">{it.body}</p>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
