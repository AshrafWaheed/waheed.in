'use client';

/**
 * ServiceCta — §8, the close.
 *
 * Every page on this site closes differently on purpose: / bleeds a rosette up
 * from the bottom edge, /about splits the ask from the action across a hairline,
 * /packages insets a bordered panel, /faq runs a compact bar. This one is a
 * centred stack held inside a bracket — two short rules that stop well short of
 * the measure, so the copy is framed without being boxed.
 *
 * No rosette, no engine. The hero at the top of this page already carries the
 * geometry, and the closing gesture on a service page should be the sentence,
 * not the ornament.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import type { ServicePage } from '@/content/services';

export default function ServiceCta({ page }: { page: ServicePage }) {
  const { heading, body } = page.cta;

  return (
    <section className="sd-cta" data-section-color="dark">
      <div className="cnt sd-cta-in">
        <span className="sd-cta-rule" aria-hidden="true" />
        <h2 className="sd-cta-h">
          <SplitReveal text={heading.lead} by="word" />{' '}
          <em>
            <SplitReveal text={heading.em} by="word" />
          </em>
        </h2>
        <p className="sd-cta-b reveal">{body}</p>
        <div className="sd-cta-acts">
          <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
        </div>
        <span className="sd-cta-rule" aria-hidden="true" />
      </div>
    </section>
  );
}
