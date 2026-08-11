'use client';

/**
 * ServicesHybrid — "Growth System Packages", rebuilt to the Figma redesign.
 *
 * Three checklist cards on a light section: two teal tiers flanking a raised,
 * darker "Foundation Engagements" card wearing a gold "For best results" tab.
 * Every inclusion is a gold ✦ + a line of copy; each card closes with a
 * "Contact us" StackButton. Copy is `growthPackages` in content/home.ts.
 *
 * The older paragraph-card version (and the `services` content it read) is gone
 * from here but kept in content for the unmounted Services.tsx variant.
 */
import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import Spotlight from '@/components/motion/Spotlight';
import ScrubReveal from '@/components/motion/ScrubReveal';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
import StackButton from '@/components/ui/StackButton';
import { growthPackages } from '@/content/home';

/** The inclusion bullet — a four-point gold spark, matching the Figma. */
function Spark() {
  return (
    <svg className="gp-spark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0 C8.6 4 12 7.4 16 8 C12 8.6 8.6 12 8 16 C7.4 12 4 8.6 0 8 C4 7.4 7.4 4 8 0 Z" />
    </svg>
  );
}

/** Wrap the one underlined phrase in the sub. */
function Sub({ text, underline }: { text: string; underline: string }) {
  const i = text.indexOf(underline);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="gp-uline">{underline}</span>
      {text.slice(i + underline.length)}
    </>
  );
}

export default function ServicesHybrid() {
  const { heading, sub, subUnderline, footnote, cta, cards } = growthPackages;
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Heading scroll-reveals (fade-up); the three cards scrub in — left from the
  // left, the featured middle up, the right from the right.
  const pHead = useScrollProgress(headRef);
  const pGrid = useScrollProgress(gridRef, { startVh: 0.95, endVh: 0.5 });
  const headY = useTransform(pHead, [0, 0.8], [40, 0], { clamp: true });
  const headO = useTransform(pHead, [0, 0.55], [0, 1], { clamp: true });

  return (
    <section className="gp" data-section-color="light">
      <div className="cnt">
        <motion.div className="gp-head" ref={headRef} style={{ y: headY, opacity: headO }}>
          <h2 className="gp-h">{heading}</h2>
          <p className="gp-sub">
            <Sub text={sub} underline={subUnderline} />
          </p>
        </motion.div>

        <div className="gp-grid" ref={gridRef}>
          {cards.map((card, i) => (
            <ScrubReveal
              key={card.title}
              progress={pGrid}
              from={0}
              to={0.85}
              x={card.featured ? 0 : i === 0 ? -72 : 72}
              y={card.featured ? 72 : 0}
              className={`gp-card-wrap${card.featured ? ' featured' : ''}`}
            >
              <Spotlight className="gp-card-spot">
              <article className={`gp-card${card.featured ? ' featured' : ''}`} data-cursor>
                {'badge' in card && card.badge && <span className="gp-badge">{card.badge}</span>}

                <h3 className="gp-title">{card.title}</h3>

                <ul className="gp-list">
                  {card.items.map((item) => (
                    <li key={item} className="gp-item">
                      <Spark />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {'note' in card && card.note && <p className="gp-note">{card.note}</p>}

                <div className="gp-cta">
                  <StackButton href={cta.href} size="sm">{cta.label}</StackButton>
                </div>
              </article>
              </Spotlight>
            </ScrubReveal>
          ))}
        </div>

        <p className="gp-foot">{footnote}</p>
      </div>
    </section>
  );
}
