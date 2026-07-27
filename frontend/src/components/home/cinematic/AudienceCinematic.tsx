'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import AudienceGlyph from '@/components/graphics/AudienceGlyph';
import { audience } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const rowV: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

// Cinematic audience — no hover-expand; all four rows are open and reveal in
// sequence as you scroll (scroll-driven, not interactive).
export default function AudienceCinematic() {
  const { eyebrow, heading, items } = audience;
  return (
    <section className="hy-aud cn-aud" data-section-color="light">
      <div className="cnt">
        <div className="hy-aud-head">
          <span className="hy-aud-eyebrow">{eyebrow}</span>
          <h2 className="hy-aud-h">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em><SplitReveal text={heading.em!} by="word" /></em>
          </h2>
        </div>
        <div className="hy-aud-list">
          {items.map((item, i) => (
            <motion.div
              key={item.num}
              className="hy-aud-row open cn-aud-row"
              variants={rowV}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="hy-aud-row-head">
                <span className="hy-aud-num">{item.num}</span>
                <span className="hy-aud-title">{item.title}</span>
                <span className="hy-aud-glyph"><AudienceGlyph i={i} /></span>
              </div>
              <div className="hy-aud-body">
                <div className="hy-aud-body-inner"><p>{item.body}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
