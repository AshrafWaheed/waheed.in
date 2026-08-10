'use client';

/**
 * FoundingStoryAbout — "Our Founding Story", the first body section of the
 * redesigned /about page (WAHEEDWEB Figma, node 74:428–74:436).
 *
 * A LIGHT band (white) that breaks the page's dark run: a portrait placeholder
 * on the left, the heading + two paragraphs on the right. Distinct from the
 * homepage teaser (FoundingStoryHybrid, dark, with a "Learn more" button) — this
 * is the full opening of the story, no CTA. Copy is `foundingStory` in
 * content/about.ts, verbatim from the Figma.
 *
 * The Figma sets the heading in a bold sans (Inter ExtraBold); mapped to the
 * site's own sans (DM Sans) at 800 rather than adding a font. Reveal is an
 * IntersectionObserver whileInView (works under Lenis) — the heading splits in,
 * the copy fades up, the portrait eases in from the left.
 */
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import { foundingStory } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FoundingStoryAbout() {
  const { heading, paras } = foundingStory;
  const reduce = useReducedMotion();

  return (
    <section className="afs" data-section-color="light">
      <div className="cnt afs-grid">
        {/* Portrait placeholder — a faint khatam on a night panel, ready to
            swap for a real founder portrait (drop an <img> into .afs-media). */}
        <motion.div
          className="afs-media"
          role="img"
          aria-label="The Waheed founders — portrait coming soon"
          initial={reduce ? false : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Khatam size={150} inner={0.5} stroke="rgba(255,255,255,.16)" strokeWidth={1.4} className="afs-media-mark" />
        </motion.div>

        <div className="afs-copy">
          <h2 className="afs-h">
            <SplitReveal text={heading} by="word" />
          </h2>

          {paras.map((p, i) => (
            <motion.p
              key={i}
              className="afs-p"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
