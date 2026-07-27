'use client';

import { useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import { newsletter } from '@/content/home';

// Cinematic newsletter — same form + /api/newsletter contract as the Hybrid one,
// but a plain submit (no explode-fill; cinematic keeps tactile hover minimal).
export default function NewsletterCinematic() {
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

  const { eyebrow, heading, body, success, placeholder, submitIdle, submitBusy, note } = newsletter;
  return (
    <section className="hy-nl cn-nl" data-section-color="light">
      <div className="cnt hy-nl-grid">
        <div className="hy-nl-copy">
          <span className="hy-nl-eyebrow">{eyebrow}</span>
          <h2 className="hy-nl-h">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em><SplitReveal text={heading.em!} by="word" /></em>
          </h2>
          <p className="hy-nl-body">{body}</p>
        </div>
        <div className="hy-nl-form-wrap">
          {submitted ? (
            <p className="hy-nl-success">{success}</p>
          ) : (
            <form className="hy-nl-form" onSubmit={handleSubmit} noValidate>
              <input
                className="hy-nl-input"
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                disabled={submitting}
              />
              <button type="submit" className="btn btn-gold" data-cursor disabled={submitting}>
                {submitting ? submitBusy : submitIdle}
              </button>
            </form>
          )}
          {error && <p className="hy-nl-error">{error}</p>}
          <p className="hy-nl-note">{note}</p>
        </div>
      </div>
    </section>
  );
}
