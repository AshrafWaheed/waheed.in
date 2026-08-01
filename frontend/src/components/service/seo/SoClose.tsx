'use client';

/**
 * SoClose — §8. The curve, still climbing on the way out.
 *
 * Five closes, five gestures: / bleeds a rosette, /about splits across a
 * hairline, /packages insets a panel, /faq runs a compact bar, the default
 * service layout brackets the copy between two short rules, page 03 hangs
 * everything off one full-measure rule. This one runs a rising line across the
 * whole section, passing behind the copy and leaving at the top right — the
 * page's own chart, still climbing on the way out.
 *
 * The line is one path with `vector-effect="non-scaling-stroke"` and the same
 * `m^1.9` shape as the hero chart, so the closing gesture is the opening claim
 * carried through.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import type { ServicePage } from '@/content/services';

/** Same curve as CompoundCurve's organic line, sampled across the section. */
function risePath(w = 1200, h = 300): string {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    pts.push(`${(t * w).toFixed(1)},${(h - Math.pow(t, 1.9) * (h - 26)).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

export default function SoClose({ page }: { page: ServicePage }) {
  const { eyebrow, heading, body } = page.cta;

  return (
    <section className="so-close" data-section-color="dark">
      <svg
        className="so-close-curve"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={risePath()}
          stroke="var(--rd-gold-line)" strokeOpacity=".5" strokeWidth="1.6"
          vectorEffect="non-scaling-stroke" strokeLinecap="round"
          strokeDasharray="1500" strokeDashoffset="1500"
        />
      </svg>

      <div className="cnt so-close-in">
        <p className="so-close-eyebrow">{eyebrow}</p>
        <h2 className="so-close-h">
          <SplitReveal text={heading.lead} by="word" />{' '}
          <em>
            <SplitReveal text={heading.em} by="word" />
          </em>
        </h2>
        <p className="so-close-b reveal">{body}</p>
        <div className="so-close-acts">
          <ExplodeButton href="/contact" className="btn btn-gold">
            Book a free clarity call →
          </ExplodeButton>
          <Link href="/packages" className="so-close-alt" data-cursor>
            Or compare the packages →
          </Link>
        </div>
      </div>
    </section>
  );
}
