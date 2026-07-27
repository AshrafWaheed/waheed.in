'use client';

import SplitReveal from '@/components/motion/SplitReveal';
import { DrawPath } from '@/components/motion/StrokeDraw';
import RefusalSeal from '@/components/graphics/RefusalSeal';
import { refusal } from '@/content/home';

export default function RefusalHybrid() {
  const { eyebrow, heading, intro, items } = refusal;
  return (
    <section className="hy-ref" data-section-color="dark">
      <div className="cnt hy-ref-grid">
        <div className="hy-ref-left">
          <span className="hy-ref-eyebrow">{eyebrow}</span>
          <h2 className="hy-ref-h">
            <SplitReveal text={heading.lead} by="char" />{' '}
            <em><SplitReveal text={heading.em!} by="char" /></em>{' '}
            <SplitReveal text={heading.tail!} by="char" />
          </h2>
          <p className="hy-ref-intro">{intro}</p>
          <div className="hy-ref-seal"><RefusalSeal size={120} /></div>
        </div>

        <ul className="hy-ref-list">
          {items.map((item) => (
            <li key={item} className="hy-ref-item">
              <span className="hy-ref-x">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <DrawPath d="M6 6 L18 18" duration={0.5} amount={0.6} />
                  <DrawPath d="M18 6 L6 18" duration={0.5} delay={0.12} amount={0.6} />
                </svg>
              </span>
              <p className="hy-ref-text">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
