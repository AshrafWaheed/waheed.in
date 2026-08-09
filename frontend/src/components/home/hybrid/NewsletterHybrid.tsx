'use client';

/**
 * NewsletterHybrid — "Subscribe to Waheed Brand Notes", reskinned to the Figma
 * redesign: a white rounded card centred on the dark section, with an inline
 * email field + gold Subscribe StackButton.
 *
 * Behaviour is unchanged — it still POSTs to /api/newsletter. Copy is the
 * redesign's (`newsletter.title` / `newsletter.body`).
 */
import { useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import { newsletter } from '@/content/home';

export default function NewsletterHybrid() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = email.trim();
    if (!val) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const { title, body, success, placeholder, submitIdle, submitBusy, note } = newsletter;

  return (
    <section className="nl" data-section-color="dark">
      <div className="cnt">
        <div className="nl-card">
          <h2 className="nl-h">
            <SplitReveal text={title} by="word" />
          </h2>
          <p className="nl-body">{body}</p>

          {submitted ? (
            <p className="nl-success">{success}</p>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit} noValidate>
              <input
                className="nl-input"
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                disabled={submitting}
              />
              {/* Plain button, not StackButton: it lives inside a form and the
                  three-plate travel would fight the input it sits flush against.
                  Gold face to match. */}
              <button type="submit" className="nl-submit" disabled={submitting}>
                {submitting ? submitBusy : submitIdle}
              </button>
            </form>
          )}
          {error && <p className="nl-error">{error}</p>}
          <p className="nl-note">{note}</p>
        </div>
      </div>
    </section>
  );
}
