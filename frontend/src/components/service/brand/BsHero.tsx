'use client';

/**
 * BsHero — §1. Centred copy standing inside the resolving mark.
 *
 * Neither of the other service heroes is centred: /services/web-app-development
 * is copy-left with an artifact card right, and /packages is engine-left with
 * copy right. This one is dead centre, with BrandField full-bleed behind it so
 * the two drawn rings frame the headline. The composition is the claim — you
 * are the thing that resolved out of the field.
 *
 * There is no artifact card here on purpose. A product screenshot on a brand
 * strategy page would be arguing the wrong thing.
 */
import { useEffect, useRef, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import BrandField from '@/components/graphics/BrandField';
import type { ServicePage } from '@/content/services';

// Hero copy enters via CSS (.rd-rise, transform-only), not framer initial="hidden"
// — which baked opacity:0 into the SSR HTML and pinned LCP to hydration (~8s
// mobile). The h1 keeps SplitReveal with fade={false} so its chars paint at the
// first frame. See the hero-LCP project note.
const rd = (d: string) => ({ ['--rd']: d } as React.CSSProperties);

export default function BsHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section ref={ref} className={`bs-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="bs-hero-field" aria-hidden="true">
        <BrandField />
      </div>

      <div className="cnt bs-hero-in">
        <p className="bs-eyebrow rd-rise-fade" style={rd('.15s')}>
          {eyebrow}
        </p>

        <h1 className="bs-hero-h1">
          <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.3} stagger={0.03} fade={false} />{' '}
          <em>
            <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.55} stagger={0.03} fade={false} />
          </em>
        </h1>

        <p className="bs-hero-sub rd-rise" style={rd('.32s')}>
          {sub}
        </p>

        <div className="bs-hero-acts rd-rise" style={rd('.44s')}>
          <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
        </div>

        {/* Last, not between the headline and the sub — dead centre belongs to
            the mark, and the promise was landing straight on top of it. */}
        <p className="bs-hero-promise rd-rise" style={rd('.56s')}>
          {promise}
        </p>
      </div>
    </section>
  );
}
