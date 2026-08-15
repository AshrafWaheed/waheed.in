'use client';

/**
 * ServiceHero — §1 of /services/[slug].
 *
 * Copy LEFT, the craft's own artifact RIGHT. That asymmetry is doing two jobs:
 * it keeps the five service pages from opening like /packages (engine left,
 * copy right) or /about, and it re-uses the exact artifact the homepage bento
 * showed for this craft — so arriving here from the bento feels like walking
 * INTO the card you clicked, rather than landing on an unrelated page.
 *
 * The artifact is mounted `live`, not observed: it is above the fold on every
 * viewport this hero supports, so an IntersectionObserver would only ever add a
 * frame of nothing.
 *
 * `.ab-lay` owns `transform`, so the engine centres with `translate:`.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import CraftArtifact from '@/components/graphics/CraftArtifact';
import SoftwareRig from '@/components/graphics/SoftwareRig';
import type { ServicePage } from '@/content/services';

// Hero copy enters via CSS (.rd-rise, transform-only), not framer initial="hidden"
// — which baked opacity:0 into the SSR HTML and pinned LCP to hydration (~8s
// mobile). The h1 keeps SplitReveal with fade={false} so its chars paint at the
// first frame. The decorative artifact keeps its framer fade. See the hero-LCP
// project note.
const EASE = [0.22, 1, 0.36, 1] as const;

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function ServiceHero({ page, artifact }: { page: ServicePage; artifact: number }) {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useParallaxOrigin(secRef, 9);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section ref={secRef} className={`sd-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="sd-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>

      <div className="cnt sd-hero-grid">
        <div className="sd-hero-copy">
          <p className="ab-pill rd-rise-fade" style={v({ '--rd': '.12s' })}>
            {eyebrow}
          </p>

          <h1 className="sd-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.02} fade={false} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.58} stagger={0.02} fade={false} />
            </em>
          </h1>

          <p className="sd-hero-sub rd-rise" style={v({ '--rd': '.3s' })}>
            {sub}
          </p>

          <p className="sd-hero-promise rd-rise" style={v({ '--rd': '.4s' })}>
            {promise}
          </p>

          <div className="sd-hero-acts rd-rise" style={v({ '--rd': '.5s' })}>
            <StackButton href="/contact" size="lg" arrow>
              Book a free clarity call
            </StackButton>
          </div>
        </div>

        {/* `is-live` is what the artifact's CSS animations key off — the `live`
            prop only drives the JS ones (count-ups, cycling labels). Both are
            needed, and without the class the browser mock renders empty. */}
        <motion.div
          className="sd-hero-art is-live"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          aria-hidden="true"
        >
          {page.slug === 'custom-software-development' ? <SoftwareRig /> : <CraftArtifact i={artifact} live />}
        </motion.div>
      </div>

      <span className="ab-scroll-cue" aria-hidden="true">
        <span className="hy-scroll-line" />
      </span>
    </section>
  );
}
