'use client';

/**
 * SmHero — §1. Copy left, a feed running past it on the right.
 *
 * Fifth service hero, fifth composition. The one thing that distinguishes it
 * from page 01 — which is also copy-left with an object right — is that the
 * object is not a card sitting still: it is two columns of posts travelling in
 * opposite directions, which is the only hero on the site that is still moving
 * once it has finished arriving.
 *
 * That is not decoration. The page's argument is that a feed never stops and
 * that most brands are feeding it without a system, so the hero has to show the
 * treadmill before the copy names it.
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import FeedColumns from '@/components/graphics/FeedColumns';
import type { ServicePage } from '@/content/services';

// Hero copy enters via CSS (.rd-rise, transform-only), not framer initial="hidden"
// — which baked opacity:0 into the SSR HTML and pinned LCP to hydration (~8s
// mobile; the sub paragraph is the LCP element). The h1 keeps SplitReveal with
// fade={false} so its chars are painted at the first frame. The decorative feed
// keeps its framer fade. See the hero-LCP project note.
const EASE = [0.22, 1, 0.36, 1] as const;
const rd = (d: string) => ({ ['--rd']: d } as React.CSSProperties);

export default function SmHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section className={`sm-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="cnt sm-hero-grid">
        <div className="sm-hero-copy">
          <p className="sm-eyebrow rd-rise-fade" style={rd('.12s')}>
            {eyebrow}
          </p>

          <h1 className="sm-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.024} fade={false} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.56} stagger={0.024} fade={false} />
            </em>
          </h1>

          <p className="sm-hero-sub rd-rise" style={rd('.3s')}>
            {sub}
          </p>

          <p className="sm-hero-promise rd-rise" style={rd('.4s')}>
            {promise}
          </p>

          <div className="sm-hero-acts rd-rise" style={rd('.5s')}>
            <StackButton href="/contact" size="lg" arrow>
              Book a free clarity call
            </StackButton>
          </div>
        </div>

        <motion.div
          className="sm-hero-feed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
        >
          <FeedColumns />
        </motion.div>
      </div>
    </section>
  );
}
