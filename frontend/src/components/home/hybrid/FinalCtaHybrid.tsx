'use client';

import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { finalCta } from '@/content/home';

export default function FinalCtaHybrid() {
  const { eyebrow, heading, body, cta } = finalCta;
  return (
    <section className="hy-cta" data-section-color="dark">
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
          <ExplodeButton href={cta.href} className="btn btn-gold">{cta.label}</ExplodeButton>
        </div>
      </div>
    </section>
  );
}
