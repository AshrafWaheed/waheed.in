'use client';

/**
 * QuoteAbout — the Barakah pull-quote, the fifth body section of the redesigned
 * /about page (WAHEEDWEB Figma, nodes 74:492–74:495).
 *
 * A dark band: a large centred quote with a "Waheed" attribution beneath. Copy
 * is `quote` in content/about.ts, verbatim from the Figma (curly quotes + spaced
 * em dash included). Reveal via whileInView (Lenis-safe): the quote splits in
 * word-by-word, the attribution fades up after.
 */
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import { quote } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function QuoteAbout() {
  const reduce = useReducedMotion();

  return (
    <section className="qa" data-section-color="dark">
      <div className="cnt">
        <blockquote className="qa-text">
          <SplitReveal text={quote.text} by="word" />
        </blockquote>
        <motion.p
          className="qa-by"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
        >
          {quote.by}
        </motion.p>
      </div>
    </section>
  );
}
