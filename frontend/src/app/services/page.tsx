import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:       'Services · WAHEED',
  description: 'Three engagement levels built for halal brands: Foundations Engagement, The Authority System, and Halal Brand Partnership.',
};

const CARDS = [
  {
    eyebrow:  'Web & Brand',
    title:    'Foundations Engagement',
    subtitle: 'For halal brands that need a digital home built to last, not to impress for three months.',
    desc:     'Full website + brand foundations + 30-day post-launch optimisation. Conversion-fluent, mobile-first, built on a system you can grow into.',
    featured: false,
    badge:    null,
    delay:    'delay-1',
  },
  {
    eyebrow:  'Full System',
    title:    'The Authority System',
    subtitle: 'Full website + brand system + 90-day social ramp. For founders ready to be taken seriously.',
    desc:     'Everything in Foundations, plus brand identity refresh, content strategy, social ramp-up, and quarterly review for one year.',
    featured: true,
    badge:    'Most Requested',
    delay:    'delay-2',
  },
  {
    eyebrow:  'Partnership',
    title:    'Halal Brand Partnership',
    subtitle: 'Quarterly strategy reviews and continuous build. For brands that need an ongoing partner, not a vendor.',
    desc:     'Monthly retainer covering iterative design, growth experiments, technical maintenance, and strategic counsel. Two-client cap per quarter.',
    featured: false,
    badge:    null,
    delay:    'delay-3',
  },
] as const;

export default function ServicesPage() {
  return (
    <main>

      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="cnt">
          <span className="lbl">How we build with you</span>
          <h1>
            The infrastructure halal brands are{' '}
            <em>built on.</em>
          </h1>
          <p>Three engagement levels, each strategically crafted to move the business forward.</p>
        </div>
      </div>

      {/* ── Offer Ladder ── */}
      <section className="sec" style={{ background: '#F7F3ED' }}>
        <div className="cnt">
          <div className="svc-grid" style={{ marginTop: 0 }}>
            {CARDS.map((card) => (
              <div
                key={card.title}
                className={`svc-card reveal ${card.delay}${card.featured ? ' featured' : ''}`}
              >
                {card.badge && (
                  <div className="svc-card-featured-badge">{card.badge}</div>
                )}
                <div
                  className="svc-eyebrow-label"
                  style={{ color: card.featured ? undefined : '#254851' }}
                >
                  {card.eyebrow}
                </div>
                <h3 className="svc-title">{card.title}</h3>
                <p className="svc-subtitle">{card.subtitle}</p>
                <p className="svc-desc">{card.desc}</p>
                <Link
                  href="/contact"
                  className={`btn btn-sm svc-card-cta ${card.featured ? 'btn-gold' : 'btn-outline'}`}
                >
                  Apply →
                </Link>
              </div>
            ))}
          </div>

          {/* ── Custom Plan Banner ── */}
          <div className="svc-custom-banner reveal">
            <div className="svc-custom-left">
              <span className="svc-custom-tag">Not sure what you need?</span>
              <h3 className="svc-custom-h">Request a custom service plan.</h3>
              <p className="svc-custom-p">
                Tell us your goals, your budget, and where you are right now.
                We&apos;ll put together a curated scope that fits.
              </p>
            </div>
            <Link href="/contact" className="btn btn-teal svc-custom-btn">
              Let&apos;s talk →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
