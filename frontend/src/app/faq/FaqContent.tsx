'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQS, FILTERS, CAT_LABELS, type Category } from './faqData';

export default function FaqContent() {
  const [filter, setFilter] = useState<Category>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id);
  }

  const activeCats = (filter === 'All'
    ? (['General', 'Website & App', 'Social Media', 'Payment'] as const)
    : [filter] as const
  ).filter(cat => FAQS.some(f => f.cat === cat));

  return (
    <main>

      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
          <span className="lbl">Frequently Asked Questions</span>
          <h1>Your questions, <em>honestly answered.</em></h1>
          <p>Everything you need to know about working with Waheed.</p>
        </div>
      </div>

      {/* ── FAQ body ── */}
      <section className="sec" style={{ background: '#FFFDF9' }}>
        <div className="cnt faq-wrap">

          {/* Filter tabs */}
          <div className="faq-filters" role="tablist" aria-label="FAQ categories">
            {FILTERS.map(cat => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                className={`faq-filter-btn${filter === cat ? ' active' : ''}`}
                onClick={() => { setFilter(cat); setOpenId(null); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Category sections */}
          {activeCats.map(cat => {
            const items = FAQS.filter(f => f.cat === cat);
            return (
              <div key={cat} className="faq-section">
                <div className="faq-cat-header">
                  <span className="faq-cat-bar" />
                  <span className="faq-cat-label">{CAT_LABELS[cat]}</span>
                </div>

                <div className="faq-acc">
                  {items.map((item) => {
                    const id  = `${cat}::${item.q}`;
                    const open = openId === id;
                    return (
                      <div
                        key={id}
                        className={`aud-acc-item${open ? ' open' : ''}`}
                      >
                        <button
                          className="aud-acc-head"
                          type="button"
                          aria-expanded={open}
                          onClick={() => toggle(id)}
                        >
                          <span className="aud-acc-title">{item.q}</span>
                          <span className="aud-acc-chev" aria-hidden="true" />
                        </button>
                        <div className="aud-acc-body">
                          <p>{item.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec" style={{ background: '#F7F3ED', textAlign: 'center' }}>
        <div className="cnt">
          <span className="eyebrow-v2 center reveal">Still have questions?</span>
          <h2 className="reveal delay-1" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.7rem,2.4vw,2.1rem)',
            color: '#254851',
            fontWeight: 500,
            marginBottom: '1rem',
            lineHeight: 1.15,
          }}>
            Ask us directly.
          </h2>
          <p className="reveal delay-2" style={{ fontSize: '.9rem', color: '#6B6B6B', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            Fill out our project application form and we&apos;ll answer any questions during your
            discovery call, in shā&apos; Allāh.
          </p>
          <Link href="/contact" className="btn btn-teal reveal delay-2">
            Apply for a Discovery Call →
          </Link>
        </div>
      </section>

    </main>
  );
}
