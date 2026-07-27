'use client';

import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { finalCta } from '@/content/home';

// Cinematic final CTA — the rosette assembles on scroll-in; plain CTA (no explode).
export default function FinalCtaCinematic() {
  const { eyebrow, heading, body, cta } = finalCta;
  return (
    <section className="hy-cta cn-cta" data-section-color="dark">
      <div className="hy-cta-rosette" aria-hidden="true">
        <ConvergenceRosette />
      </div>
      <div className="cnt hy-cta-inner">
        <span className="hy-cta-eyebrow">{eyebrow}</span>
        <h2 className="hy-cta-h">
          <SplitReveal text={heading.lead} by="word" />{' '}
          <em><SplitReveal text={heading.em!} by="word" /></em>
        </h2>
        <p className="hy-cta-body">{body}</p>
        <div className="hy-cta-acts">
          <Link href={cta.href} className="btn btn-gold" data-cursor>{cta.label}</Link>
        </div>
      </div>
    </section>
  );
}
