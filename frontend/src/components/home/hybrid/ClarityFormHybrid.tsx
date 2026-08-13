'use client';

/**
 * ClarityFormHybrid — "Have a project in mind? Book a clarity call."
 *
 * Replaces the old FinalCta. The flow, per instruction:
 *   1. submit posts to the LIVE /api/contact pipe (HubSpot contact + company +
 *      deal, keyed by email);
 *   2. on success the visitor is sent to /book PREFILLED with the same email;
 *   3. the booking's own HubSpot sync then upserts that same contact (by email)
 *      and attaches the meeting to it.
 *
 * The contact endpoint requires name/brand/service/message, so `name` is sent
 * as the brand and `service` is fixed to "Clarity call"; `message` is the
 * project text (min 10 chars, matching the endpoint's rule).
 *
 * ── Reuse on /book ──────────────────────────────────────────────────────────
 * The same form leads the /book page, where the calendar sits directly below.
 * There, redirecting to /book would be a redirect to self, so `onLead` is passed
 * instead: the form still fires the /api/contact lead, then hands the prefill
 * back to the page to reveal and scroll to the on-page calendar. `showDirect` is
 * turned off there too — the "or book directly" link is redundant beside the
 * calendar it points at.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import { clarityForm } from '@/content/home';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ClarityLead {
  email: string;
  company: string;
  phone?: string;
}

interface ClarityFormProps {
  /**
   * When set, the form does NOT redirect to /book on success — it calls this
   * with the captured prefill so the caller can reveal an on-page calendar.
   */
  onLead?: (lead: ClarityLead) => void;
  /** Show the "or book a call directly" secondary link. Default true. */
  showDirect?: boolean;
}

export default function ClarityFormHybrid({ onLead, showDirect = true }: ClarityFormProps = {}) {
  const router = useRouter();
  const { heading, body, fields, submitIdle, submitBusy, bookDirect, error: errCopy } = clarityForm;

  const [form, setForm] = useState({ brand: '', project: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const brand = form.brand.trim();
    const project = form.project.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (brand.length < 2) return setError('Please tell us your brand name.');
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid email address.');
    if (project.length < 10) return setError('A sentence or two about your project helps us prepare.');

    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brand,          // endpoint requires a name; the real name is captured at /book
          email,
          brand,
          phone: phone || undefined,
          service: 'Clarity call',
          message: project,
        }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? 'submission_failed');
      }
      // On /book the calendar is on this same page: hand the prefill up instead
      // of redirecting to self.
      if (onLead) {
        onLead({ email, company: brand, phone: phone || undefined });
        setSubmitting(false);
        return;
      }
      // Otherwise carry the email to /book so the booking attaches to the same
      // HubSpot contact; company/phone prefill the booking form too.
      const qs = new URLSearchParams({ email, company: brand });
      if (phone) qs.set('phone', phone);
      router.push(`/book?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error && err.message !== 'submission_failed' ? err.message : errCopy);
      setSubmitting(false);
    }
  }

  return (
    <section className="cf" data-section-color="dark">
      <div className="cnt cf-grid">
        <div className="cf-copy">
          <h2 className="cf-h">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em><SplitReveal text={heading.em!} by="word" /></em>
          </h2>
          <p className="cf-body">{body}</p>
          {showDirect && (
            <p className="cf-alt">
              <a href={bookDirect.href} className="cf-alt-link" data-cursor>{bookDirect.label} →</a>
            </p>
          )}
        </div>

        <form className="cf-form" onSubmit={onSubmit} noValidate>
          <input
            className="cf-input" placeholder={fields.brand} aria-label={fields.brand}
            value={form.brand} onChange={set('brand')} maxLength={255} autoComplete="organization"
          />
          <textarea
            className="cf-input cf-textarea" placeholder={fields.project} aria-label={fields.project}
            value={form.project} onChange={set('project')} maxLength={5000} rows={4}
          />
          <input
            className="cf-input" type="email" placeholder={fields.email} aria-label={fields.email}
            value={form.email} onChange={set('email')} maxLength={255} autoComplete="email"
          />
          <input
            className="cf-input" type="tel" inputMode="tel" placeholder={fields.phone} aria-label={fields.phone}
            value={form.phone} onChange={set('phone')} maxLength={30} autoComplete="tel"
          />

          {error && <p className="cf-error" role="alert">{error}</p>}

          <div className="cf-submit">
            <StackButton type="submit" disabled={submitting}>
              {submitting ? submitBusy : submitIdle}
            </StackButton>
          </div>
        </form>
      </div>
    </section>
  );
}
