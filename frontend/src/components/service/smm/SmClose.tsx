'use client';

/**
 * SmClose — §8. The close held between two marquees.
 *
 * Sixth closing gesture on the site: / bleeds a rosette, /about splits across a
 * hairline, /packages insets a panel, /faq runs a compact bar, the default
 * service layout brackets the copy in two short rules, page 03 hangs everything
 * off one full-measure rule, page 04 runs its own chart out of the frame. This
 * one puts the copy between two bands of moving type, travelling in opposite
 * directions — the feed still running while you decide.
 *
 * The words in the bands are the studio's own promise line, repeated. Nothing
 * invented, nothing that reads as a client list.
 *
 * Duplicated groups translated by exactly -50% is what makes the loop seamless.
 * `aria-hidden` on both: it is one phrase repeated, and a screen reader should
 * meet it once, in the heading, not eight times as decoration.
 */
import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import Khatam from '@/components/graphics/Khatam';
import type { ServicePage } from '@/content/services';

function Band({ dir }: { dir: 'l' | 'r' }) {
  const word = 'Content engagements, then sales.';
  return (
    <div className={`sm-band sm-band--${dir}`} aria-hidden="true">
      <div className="sm-band-track">
        {[0, 1].map((dup) => (
          <div className="sm-band-group" key={dup}>
            {Array.from({ length: 4 }, (_, n) => (
              <span className="sm-band-item" key={n}>
                {word}
                <Khatam size={12} inner={0.5} stroke="currentColor" strokeWidth={1.6} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SmClose({ page }: { page: ServicePage }) {
  const { heading, body } = page.cta;

  return (
    <section className="sm-close" data-section-color="dark">
      <Band dir="l" />

      <div className="cnt sm-close-in">
        <h2 className="sm-close-h">
          <SplitReveal text={heading.lead} by="word" />{' '}
          <em>
            <SplitReveal text={heading.em} by="word" />
          </em>
        </h2>
        <p className="sm-close-b reveal">{body}</p>
        <div className="sm-close-acts">
          <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
          <Link href="/packages" className="sm-close-alt" data-cursor>
            Or compare the packages →
          </Link>
        </div>
      </div>

      <Band dir="r" />
    </section>
  );
}
