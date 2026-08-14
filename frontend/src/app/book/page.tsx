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
 * A short dark hero states what the call is, then the calendar sits in the light
 * band below: pick a slot, then a short details step confirms it. There is no
 * lead form up top — the visitor's details are captured with the booking itself,
 * or arrive prefilled via ?email/company/phone from the homepage and /contact
 * forms (BookingFlow reads those params directly).
 */
export default function BookPage() {
  return (
    <main className="bk-main">
      <section className="bk-hero bk-hero--short" data-section-color="dark">
        <div className="cnt bk-hero-inner">
          <p className="ab-pill">Book a call</p>
          <h1 className="bk-hero-h1">
            Book a free <em>clarity call.</em>
          </h1>
          <p className="bk-hero-p">
            Thirty minutes on Google Meet — the link lands in your inbox the moment you
            book. No payment, no obligation.
          </p>
        </div>
      </section>

      <section className="bk-body" data-section-color="light">
        <div className="cnt">
          <div className="bk-body-head">
            <p className="ab-pill">Pick a time</p>
            <h2 className="bk-body-h">Choose a slot that suits you.</h2>
          </div>
          <BookingFlow />
        </div>
      </section>
    </main>
  );
}
