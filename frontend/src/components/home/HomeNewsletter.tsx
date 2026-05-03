'use client';
import { useState } from 'react';
import SectionTag from '@/components/ui/SectionTag';

export default function HomeNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-[var(--yellow)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="block w-8 h-px bg-[var(--text-dark)]" />
              <span className="font-[var(--font-dm-sans)] text-xs font-semibold uppercase tracking-widest text-[var(--text-dark)]">
                Stay Connected
              </span>
            </div>
            <h2
              className="font-[var(--font-cormorant)] text-[var(--text-dark)] font-light leading-snug mt-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Occasional thoughts on faith, business &amp; the web.
            </h2>
            <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-base leading-relaxed mt-4">
              No spam. No hype. Just honest reflections — sent only when there is something worth saying.
            </p>
            <ul className="mt-6 space-y-2">
              {['100% Halal Content', 'No Ads. Ever.', 'Unsubscribe Anytime'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[var(--text-dark)] font-bold text-sm">✦</span>
                  <span className="font-[var(--font-dm-sans)] text-sm text-[var(--text-dark)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="font-[var(--font-dm-sans)] bg-[var(--cream)] text-[var(--text-dark)] placeholder-[var(--text-light)] rounded-xl px-5 py-4 w-full border-0 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="font-[var(--font-dm-sans)] bg-[var(--green-dark)] text-[var(--cream)] text-sm font-medium rounded-xl px-6 py-4 w-full mt-3 hover:bg-[var(--green)] transition-colors duration-200"
                >
                  Subscribe — it&apos;s free
                </button>
                <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-mid)] mt-2">
                  Confirmed opt-in. Your data is never sold or shared.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <p
                  className="font-[var(--font-amiri)] text-[var(--text-dark)] mb-2"
                  style={{ fontSize: '2rem' }}
                  lang="ar"
                  dir="rtl"
                >
                  جَزَاكَ اللَّهُ خَيْرًا
                </p>
                <p className="font-[var(--font-dm-sans)] text-sm text-[var(--text-mid)]">
                  Thank you — we&apos;ll be in touch when there&apos;s something worth saying.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
