'use client';

/**
 * GapNarrative — §2, "We Saw the Same Gap, Again and Again."
 *
 * The old version stacked heading-then-four-blocks in one 760px column, which
 * gave four paragraphs of near-identical grey and no way to tell the argument
 * from the aside. Rebuilt as a sticky two-column: the heading parks on the left
 * while the narrative travels past it on the right, so the reader always has the
 * claim in view while reading the evidence for it. That is the Outcrowd sticky
 * column, and it is the reason this section needs no scroll-jacking — CSS
 * `position: sticky` does the whole job. (Same reasoning as the tactile Ihsan
 * Process, which also refuses GSAP pin/scrub in favour of a sticky rail.)
 *
 * The three text tiers are now actually distinguishable: lead, detail, and the
 * question — which is the emotional pivot of the page, so it gets a panel, a
 * drawn gold rule, cursor spotlight, and its answer as a stamped gold line.
 *
 * Copy is verbatim from content/about.ts.
 */
import { motion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import Spotlight from '@/components/motion/Spotlight';
import Khatam from '@/components/graphics/Khatam';
import { gap } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GapNarrative() {
  const [lead, detail] = gap.paras;

  return (
    <section className="ab-gap" data-section-color="light">
      <div className="cnt ab-gap-grid">
        {/* ── sticky claim ─────────────────────────────────────────── */}
        <div className="ab-gap-aside">
          <div className="ab-gap-aside-in">
            <span className="ab-eyebrow">{gap.eyebrow}</span>
            <h2 className="ab-gap-h">
              <SplitReveal text={gap.heading} by="char" stagger={0.016} />
            </h2>
            <motion.span
              className="ab-rule"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            />
            <span className="ab-gap-mark" aria-hidden="true">
              <Khatam size={30} inner={0.5} stroke="var(--rd-gold)" strokeWidth={1.2} ring />
            </span>
          </div>
        </div>

        {/* ── travelling narrative ─────────────────────────────────── */}
        <div className="ab-gap-body">
          <p className="ab-lead reveal">{lead}</p>
          <p className="ab-body reveal delay-1">{detail}</p>

          <Spotlight className="ab-ask-wrap">
            <blockquote className="ab-ask reveal delay-1">
              <motion.span
                className="ab-ask-rule"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 1, ease: EASE }}
              />
              <p className="ab-ask-q">{gap.question}</p>
              <span className="ab-ask-a">
                <Khatam size={13} inner={0.5} stroke="currentColor" strokeWidth={1.6} />
                {gap.answer}
              </span>
            </blockquote>
          </Spotlight>

          <p className="ab-body ab-body-close reveal">{gap.close}</p>
        </div>
      </div>
    </section>
  );
}
