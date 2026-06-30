'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="sec nl-sec">
      <div className="cnt">
        <div className="nl-grid">

          {/* Left — copy */}
          <div className="reveal">
            <span className="eyebrow-v2 on-dark">Halal Brand Letters</span>
            <h2 className="nl-h">
              One idea per week that builds your business{' '}
              <em>without any filter nor pitch.</em>
            </h2>
            <p className="nl-p">
              Strategic notes for halal founders — on positioning, conversion, brand integrity,
              and growing without compromise. Sent every Thursday.
            </p>
          </div>

          {/* Right — form */}
          <div className="reveal delay-2">
            {submitted ? (
              <p className="nl-success">
                You&rsquo;re on the list — Jazakallahu Khayran.
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
                />
                <button type="submit" className="btn btn-gold">
                  Subscribe →
                </button>
              </form>
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
