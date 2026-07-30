'use client';

/**
 * JourneyOutro — §4, the two closing paragraphs of the journey.
 *
 * These two have no heading in the copy and there is none to invent, so the
 * section has to earn its shape from typography and one graphic rather than from
 * a title. It gets: a faint rosette watermark, a drawn gold thread down the left
 * that grows as the block enters, and a deliberate step down in scale between
 * the first paragraph (the realisation — set as a lead) and the second (the
 * conclusion — set as body). In the old page these two sat in the same 0.92rem
 * grey as everything above them and simply read as more of the same.
 *
 * Copy is verbatim from content/about.ts.
 */
import { motion } from 'framer-motion';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { outro } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function JourneyOutro() {
  const [realisation, conclusion] = outro.paras;

  return (
    <section className="ab-outro" data-section-color="light">
      <div className="ab-outro-rosette" aria-hidden="true">
        <ConvergenceRosette />
      </div>

      {/* .ab-outro-inner is nested inside .cnt, not merged with it — see the CSS. */}
      <div className="cnt">
        <div className="ab-outro-inner">
          <motion.span
            className="ab-outro-thread"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <p className="ab-lead reveal">{realisation}</p>
          <p className="ab-body reveal delay-1">{conclusion}</p>
        </div>
      </div>
    </section>
  );
}
