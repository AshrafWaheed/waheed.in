'use client';

import { useState } from 'react';
import Link from 'next/link';

type Category = 'All' | 'General' | 'Website & App' | 'Social Media' | 'Payment';

const FILTERS: Category[] = ['All', 'General', 'Website & App', 'Social Media', 'Payment'];

interface FaqItem { cat: Exclude<Category, 'All'>; q: string; a: string; }

const FAQS: FaqItem[] = [
  // ── General ──────────────────────────────────────────────────
  {
    cat: 'General',
    q: 'What makes Waheed different from other digital agencies?',
    a: 'Waheed combines strategic technology, web and app development, and digital growth with a Shariah-aligned approach. We build high-performing digital products and marketing systems that prioritize clarity, conversion, and long-term credibility — without manipulative tactics or compromising your values. We believe barakah and real business results are not opposites. When technology, strategy, and marketing are built with integrity and excellence, growth becomes sustainable.',
  },
  {
    cat: 'General',
    q: 'Do you only work with Muslim clients?',
    a: 'We primarily serve Muslim-led brands and organizations. However, we also welcome values-aligned clients who respect our ethical and faith-based principles and serve Muslim audiences.',
  },
  {
    cat: 'General',
    q: 'What does "faith-aligned" actually mean?',
    a: 'Faith-aligned means ethical marketing, modest branding, and no deceptive or haram practices. We avoid manipulative tactics and prioritize trust, transparency, and long-term impact.',
  },
  {
    cat: 'General',
    q: 'Do you help with brand strategy and messaging?',
    a: 'Yes. Before designing your website or launching a marketing campaign, we help refine your positioning, messaging, audience clarity, and unique value proposition. Clear messaging is the foundation of effective marketing.',
  },
  {
    cat: 'General',
    q: 'Do you help with Islamic messaging and brand positioning?',
    a: 'Yes. We help you communicate your mission in a way that is authentic, respectful, and aligned with Islamic values.',
  },
  {
    cat: 'General',
    q: 'How do you ensure your marketing strategies are halal?',
    a: 'We avoid deceptive tactics, inappropriate visuals, and unethical persuasion. Every strategy is built around transparency, integrity, and trust.',
  },
  {
    cat: 'General',
    q: "We've worked with agencies before and didn't see results. How are you different?",
    a: 'We begin with research and strategy — not just design. Every recommendation is based on your audience, positioning, and business objectives, ensuring your website and marketing work together to generate meaningful results.',
  },
  {
    cat: 'General',
    q: 'How do we get started?',
    a: "Simply fill out our Project Application Form. We'll review your inquiry and schedule a discovery call if we're a good fit, in shā' Allāh.",
  },

  // ── Website & App ─────────────────────────────────────────────
  {
    cat: 'Website & App',
    q: 'What kinds of websites do you build?',
    a: 'We build custom websites tailored to your brand, audience, and business goals — from corporate websites and service businesses to e-commerce stores, nonprofit organizations, and startup platforms.',
  },
  {
    cat: 'Website & App',
    q: 'Do you build mobile apps as well?',
    a: 'Yes. We develop both websites and custom web or mobile applications, including MVPs, client portals, dashboards, internal tools, booking systems, and other custom software solutions.',
  },
  {
    cat: 'Website & App',
    q: 'Do you use templates?',
    a: 'No. Every project is custom-designed to reflect your brand, communicate your message clearly, and create a seamless user experience.',
  },
  {
    cat: 'Website & App',
    q: 'Can you redesign our existing website?',
    a: 'Absolutely. We audit your current website and transform it into a more strategic, modern, and conversion-focused platform.',
  },
  {
    cat: 'Website & App',
    q: 'How long does it take to build a website or application?',
    a: "Most website projects take around 4–8 weeks, while custom applications vary depending on scope and complexity. We'll provide a timeline after understanding your project requirements.",
  },
  {
    cat: 'Website & App',
    q: 'Will our website be mobile-friendly and SEO-ready?',
    a: 'Yes. Every website is fully responsive and built with foundational SEO best practices to improve visibility, usability, and performance.',
  },
  {
    cat: 'Website & App',
    q: 'Will our website or app be fast and secure?',
    a: 'Yes. We prioritize speed, performance, and security throughout development, following industry best practices to ensure a reliable and trustworthy user experience.',
  },
  {
    cat: 'Website & App',
    q: 'Can you build e-commerce websites?',
    a: 'Yes. We create secure, user-friendly online stores designed to provide a seamless shopping experience while supporting your business growth.',
  },
  {
    cat: 'Website & App',
    q: 'Can you integrate third-party tools?',
    a: 'Absolutely. We can integrate payment gateways, CRM systems, email marketing platforms, analytics tools, APIs, booking systems, and other software your business relies on.',
  },
  {
    cat: 'Website & App',
    q: "Who owns the website or application after it's completed?",
    a: 'Once the project is completed and final payment has been made, you own your website or application. We ensure you have access to your project and provide guidance for ongoing management.',
  },
  {
    cat: 'Website & App',
    q: 'Do you provide maintenance and ongoing support?',
    a: 'Yes. We offer maintenance plans that include software updates, security monitoring, bug fixes, backups, and technical support after launch.',
  },

  // ── Social Media ──────────────────────────────────────────────
  {
    cat: 'Social Media',
    q: 'Do you fully manage social media accounts?',
    a: 'Yes. We offer both strategy-only consulting and full social media management, including content planning, creative direction, caption writing, publishing, and performance reporting.',
  },
  {
    cat: 'Social Media',
    q: 'Which social media platforms do you support?',
    a: 'We primarily work with Instagram, LinkedIn, Facebook, and X, depending on where your audience is most active. We focus on intentional marketing rather than trying to be everywhere.',
  },
  {
    cat: 'Social Media',
    q: 'Do you create the content for us?',
    a: "Yes. Depending on your package, we develop content strategy, post ideas, captions, and creative direction. However, your behind-the-scenes content, expertise, reflections, and experiences make your brand significantly more authentic. The strongest marketing combines your voice with our strategy.",
  },
  {
    cat: 'Social Media',
    q: 'Will social media actually grow our business?',
    a: 'When approached strategically, yes. Social media builds awareness, trust, authority, and relationships — but success comes from clear positioning and consistency rather than simply posting frequently.',
  },
  {
    cat: 'Social Media',
    q: 'Do you guarantee followers or viral posts?',
    a: "No. We don't use artificial growth tactics or chase vanity metrics. Instead, we focus on sustainable growth, meaningful engagement, and attracting the right audience.",
  },
  {
    cat: 'Social Media',
    q: 'How long before we see results?',
    a: 'Organic growth takes consistency. Many clients begin seeing stronger engagement, improved brand clarity, and increased inquiries within 1–3 months, although timelines vary depending on the industry and consistency.',
  },
  {
    cat: 'Social Media',
    q: 'Can you align our social media with our website?',
    a: 'Absolutely. Your website and social media should work together. We ensure your messaging, visuals, and calls-to-action remain consistent across every customer touchpoint.',
  },

  // ── Payment ───────────────────────────────────────────────────
  {
    cat: 'Payment',
    q: 'Do you offer payment plans?',
    a: "Yes. We typically require an upfront deposit, with the remaining balance divided into milestone-based payments throughout the project. We don't use interest-based payment plans — our structure is straightforward, fair, and transparent.",
  },
];

const CAT_LABELS: Record<Exclude<Category, 'All'>, string> = {
  'General':       'General',
  'Website & App': 'Website & App Development',
  'Social Media':  'Social Media Marketing',
  'Payment':       'Payment',
};

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
          <h1>Questions, <em>answered.</em></h1>
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
              <div key={cat} className="faq-section reveal">
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
            fontWeight: 400,
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
