'use client';

/**
 * SoStack — §3. The six layers, as a stack that builds.
 *
 * Search is the one craft on this list where the ORDER of the work is a
 * technical fact rather than an editorial preference: content published on a
 * site that cannot be crawled ranks for nothing, no matter how good it is. So
 * the six deliverables are not a grid and not a rail — they are slabs, each one
 * indented a step further than the one it rests on, with a depth gauge on the
 * left that grows as the stack rises.
 *
 * Reading order stays 01 → 06 top to bottom, which is the order the work
 * happens in. Rendering 06 at the top to make the stack literal would have made
 * the reader meet the last layer first.
 *
 * Each slab settles up into place — translateY only, so nothing reflows.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SoStack({ page }: { page: ServicePage }) {
  const { eyebrow, heading, sub, items } = page.build;
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.2 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="so-stack" data-section-color="dark">
      <div className="cnt">
        <header className="so-head">
          <p className="so-eyebrow">{eyebrow}</p>
          <h2 className="so-h2 so-h2--on-night">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="so-lede so-lede--on-night reveal">{sub}</p>
        </header>

        <ol className="so-layers">
          {items.map((it, i) => (
            <li
              key={it.num}
              ref={(el) => { refs.current[i] = el; }}
              className="so-layer"
              style={v({ '--k': i, '--of': items.length - 1 })}
            >
              <span className="so-layer-gauge" aria-hidden="true">
                <span className="so-layer-gauge-fill" />
              </span>
              <span className="so-layer-n">{it.num}</span>
              <div className="so-layer-body">
                <h3 className="so-layer-t">{it.title}</h3>
                <p className="so-layer-b">{it.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="so-layers-foot" aria-hidden="true">
          <span>Foundation</span>
          <span className="so-layers-arrow" />
          <span>Surface</span>
        </p>
      </div>
    </section>
  );
}
