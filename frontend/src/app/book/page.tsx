import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import BookingFlow from './BookingFlow';

export const metadata: Metadata = pageMeta({
  title: 'Book a call · WAHEED',
  description:
    'Book a 30-minute clarity call with WAHEED. Pick a time that suits you and we will send a Google Meet link — no payment, no obligation.',
  path: '/book',
});

/**
 * /book — the public booking page.
 *
 * A short hero and then the flow, nothing else. This page has exactly one job,
 * so it carries no scroll cue, no secondary sections and no aside: anything
 * below the calendar is something to scroll past on the way to the only action
 * that matters.
 */
export default function BookPage() {
  return (
    <main>
      <section className="bk-hero" data-section-color="dark">
        <div className="cnt bk-hero-inner">
          <p className="ab-pill">A conversation, not a pitch</p>
          <h1 className="bk-hero-h1">
            Book a <em>clarity call.</em>
          </h1>
          <p className="bk-hero-p">
            Thirty minutes to talk through what you&apos;re building, what it has to do, and whether
            we&apos;re the right people to build it. You&apos;ll get a Google Meet link the moment you
            book.
          </p>
        </div>
      </section>

      <section className="bk-body" data-section-color="light">
        <div className="cnt">
          <BookingFlow />
        </div>
      </section>
    </main>
  );
}
