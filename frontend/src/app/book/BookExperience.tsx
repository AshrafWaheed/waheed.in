'use client';

/**
 * BookExperience — the body of /book.
 *
 * The page leads with the SAME short form that closes the homepage
 * (ClarityFormHybrid), then puts the calendar directly beneath it, so the one
 * page answers both "tell us about your project" and "pick a time".
 *
 * The two talk to each other without a page navigation:
 *   • Filling the short form fires the /api/contact lead, then hands its
 *     prefill down to the calendar and glides the visitor to it.
 *   • Arriving with ?email=/?company=/?phone= — the way the homepage form and
 *     the /contact form both hand off to here — means the lead is already
 *     captured, so we scroll straight past the form to the calendar (which
 *     reads those same params itself to prefill the details step).
 */
import { useEffect, useRef, useState } from 'react';
import ClarityFormHybrid, { type ClarityLead } from '@/components/home/hybrid/ClarityFormHybrid';
import BookingFlow from './BookingFlow';

export default function BookExperience() {
  const [prefill, setPrefill] = useState<ClarityLead | null>(null);
  const calRef = useRef<HTMLElement>(null);

  const toCalendar = () => {
    // A frame's grace so any freshly-revealed layout is measured before we move.
    requestAnimationFrame(() =>
      calRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('email') || q.get('company') || q.get('phone')) {
      // Let the page paint, then take them down to the calendar.
      const t = setTimeout(toCalendar, 350);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <ClarityFormHybrid showDirect={false} onLead={(lead) => { setPrefill(lead); toCalendar(); }} />

      <section className="bk-body" data-section-color="light" id="book-calendar" ref={calRef}>
        <div className="cnt">
          <div className="bk-body-head">
            <p className="ab-pill">Pick a time</p>
            <h2 className="bk-body-h">Now choose a slot.</h2>
            <p className="bk-body-p">
              Thirty minutes on Google Meet — the link lands in your inbox the moment you book.
              No payment, no obligation.
            </p>
          </div>
          <BookingFlow prefill={prefill} />
        </div>
      </section>
    </>
  );
}
