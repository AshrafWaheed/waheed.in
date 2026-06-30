'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay: i * 0.1 },
  }),
};

export default function Hero() {
  return (
    <section className="home-hero">
      <div className="hh-left">
        <div className="hh-text">

          {/* Bismillah */}
          <motion.p
            className="hh-bismillah"
            lang="ar"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </motion.p>

          {/* Eyebrow */}
          <motion.p
            className="hh-tag"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Ihsan-Led Tech &amp; Marketing for Halal, Impact-Driven Initiatives
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="hh-h1"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Scale your brand online{' '}
            <em>without compromising your values.</em>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className="hh-sub"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            We build your tech. We sharpen your brand. We grow your audience.
            All of it grounded in Islamic principles, from the first brief to
            the final deliverable.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hh-ctas"
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link href="/contact" className="btn btn-gold">
              Apply for a Free Discovery Call
            </Link>
            <Link href="/services" className="btn btn-outline-lt">
              Explore Our Services
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE }}
        >
          <span>scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </div>
    </section>
  );
}
