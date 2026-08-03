'use client';

/**
 * WaHero — §1 of 01 · Web & App Development.
 *
 * A delta on ServiceHero, not a replacement for it: the section keeps `.sd-hero`
 * so the background, the girih engine and the grid stay identical to the other
 * service pages, and `.wa-hero` only overrides what this page needs. Same
 * layering the rest of the site uses (`hy-` / `tc-` / `sd-`).
 *
 * Two things change, and both are answers to the same note — that the hero read
 * as a still image, and that it only talked about websites:
 *
 *   · the artifact is DeviceRig instead of CraftArtifact — a rig that keeps
 *     cycling between the site, the app and the system behind both, so the phone
 *     is a first-class object here rather than a detail cropped by the card
 *   · a stack strip runs along the bottom of the hero, naming the surfaces
 *     before the reader has scrolled a pixel
 *
 * The strip is `aria-hidden`: it is five nouns that the build section states
 * properly in sentences, and read aloud it is noise between the buttons and the
 * page.
 *
 * The scroll cue the other service heroes carry is dropped here — the strip now
 * occupies the bottom of the section, and a centred cue lands on top of it.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import DeviceRig from '@/components/graphics/DeviceRig';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

const STACK = ['Next.js', 'React Native', 'TypeScript', 'One design system', 'iOS · Android · Web'];

export default function WaHero({ page }: { page: ServicePage }) {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useParallaxOrigin(secRef, 9);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section
      ref={secRef}
      className={`sd-hero wa-hero${inView ? ' is-in' : ''}`}
      data-section-color="dark"
    >
      <div className="sd-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>

      <div className="cnt sd-hero-grid">
        <div className="sd-hero-copy">
          <motion.p className="ab-pill" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
            {eyebrow}
          </motion.p>

          <h1 className="sd-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.02} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.58} stagger={0.02} />
            </em>
          </h1>

          <motion.p className="sd-hero-sub" custom={0.85} variants={fadeUp} initial="hidden" animate="visible">
            {sub}
          </motion.p>

          <motion.p className="sd-hero-promise" custom={1} variants={fadeUp} initial="hidden" animate="visible">
            {promise}
          </motion.p>

          <motion.div className="sd-hero-acts" custom={1.12} variants={fadeUp} initial="hidden" animate="visible">
            <ExplodeButton href="/contact" className="btn btn-gold">
              Book a free clarity call →
            </ExplodeButton>
            <Link href="/packages" className="btn btn-outline-lt" data-cursor>
              See the packages
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="wa-art"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        >
          <DeviceRig />
        </motion.div>
      </div>

      <div className="cnt wa-stack" aria-hidden="true">
        {STACK.map((s, i) => (
          <span key={s} className="wa-stack-i" style={v({ '--k': i })}>
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
