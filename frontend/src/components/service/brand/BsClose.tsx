'use client';

/**
 * BsClose — §8. A left-aligned close under one full-measure rule.
 *
 * Every page on this site ends differently on purpose: / bleeds a rosette up
 * from the bottom edge, /about splits the ask from the action across a hairline,
 * /packages insets a bordered panel, /faq runs a compact bar, and the default
 * service layout brackets the copy between two short rules. This one opens with
 * a single rule across the full measure and hangs everything off its left edge —
 * the same left margin the whole page has been reading against, so the last
 * screen lands on the line the reader's eye is already following.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import type { ServicePage } from '@/content/services';

export default function BsClose({ page }: { page: ServicePage }) {
  const { heading, body } = page.cta;

  return (
    <section className="bs-close" data-section-color="dark">
      <div className="cnt bs-close-in">
        <span className="bs-close-rule" aria-hidden="true" />

        <div className="bs-close-grid">
          <div>
            <h2 className="bs-close-h">
              <SplitReveal text={heading.lead} by="word" />{' '}
              <em>
                <SplitReveal text={heading.em} by="word" />
              </em>
            </h2>
          </div>

          <div className="bs-close-tail">
            <p className="bs-close-b reveal">{body}</p>
            <div className="bs-close-acts">
              <ExplodeButton href="/contact" className="btn btn-gold">
                Book a free clarity call →
              </ExplodeButton>
              <Link href="/packages" className="bs-close-alt" data-cursor>
                Or compare the packages →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
