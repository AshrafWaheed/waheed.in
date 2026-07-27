'use client';

import SplitReveal from '@/components/motion/SplitReveal';
import RefusalSeal from '@/components/graphics/RefusalSeal';
import { refusal } from '@/content/home';

// Tactile refusal — reuses the Hybrid layout, but each ✕ draws itself (a strike)
// only when you hover the item. Touch/reduced-motion shows the ✕ pre-drawn.
export default function RefusalTactile() {
  const { eyebrow, heading, intro, items } = refusal;
  return (
    <section className="hy-ref tc-ref" data-section-color="dark">
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
            <li key={item} className="hy-ref-item tc-ref-item">
              <span className="hy-ref-x tc-ref-x">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
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
