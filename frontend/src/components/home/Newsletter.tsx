'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email,       setEmail]       = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = email.trim();
    if (!val) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: val }),
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

  return (
    <section className="sec nl-sec">
      <div className="cnt">
        <div className="nl-grid">

          {/* Left, copy */}
          <div className="reveal">
            <span className="eyebrow-v2 on-dark">Halal Brand Letters</span>
            <h2 className="nl-h">
              No pitch. Just one useful idea,{' '}
              <em>every Thursday.</em>
            </h2>
            <p className="nl-p">
              Strategic notes for halal brand &amp; organisation founders, on positioning,
              conversion, brand integrity, and growing without compromise.
            </p>
          </div>

          {/* Right, form */}
          <div className="reveal delay-2">
            {submitted ? (
              <p className="nl-success">
                You&rsquo;re on the list, Jazakallahu Khayran.
              </p>
            ) : (
              <form className="nl-form" onSubmit={handleSubmit} noValidate>
                <input
                  className="nl-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                  disabled={submitting}
                />
                <button type="submit" className="btn btn-gold" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Subscribe →'}
                </button>
              </form>
            )}
            {error && (
              <p style={{ fontSize: '.8rem', color: '#f9a8a8', marginTop: '.5rem' }}>{error}</p>
            )}
            <p className="nl-note">
              Confirmed opt-in. Unsubscribe any time. We never sell or share your data.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
