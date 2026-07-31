'use client';

/**
 * FaqCta — §3. A BAR, not a hero: eyebrow, heading and body on the left, button
 * on the right, at roughly half the vertical weight of the homepage close.
 *
 * Nobody who has just read to the end of an FAQ wants another full-height
 * closing screen; they want one line and somewhere to click. It was briefly a
 * clone of the homepage close — centred stack, ConvergenceRosette at .38 behind
 * the copy — which made four pages end identically and put eight straight petal
 * edges behind the heading and the paragraph.
 *
 * Copy is verbatim from content/faq.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import { faqCta } from '@/content/faq';

export default function FaqCta() {
  return (
    <section className="hy-cta fq-cta" data-section-color="dark">
      <div className="cnt fq-cta-row">
        <div>
          <span className="hy-cta-eyebrow">{faqCta.eyebrow}</span>
          <h2 className="hy-cta-h">
            <SplitReveal text={faqCta.heading} by="word" />
          </h2>
          <p className="hy-cta-body">{faqCta.body}</p>
        </div>
        <div className="hy-cta-acts">
          <ExplodeButton href={faqCta.cta.href} className="btn btn-gold">
            {faqCta.cta.label}
          </ExplodeButton>
        </div>
      </div>
    </section>
  );
}
