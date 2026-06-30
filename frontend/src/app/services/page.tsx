import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:       'Services — WAHEED',
  description: 'Three engagement levels built for halal brands: Foundations Engagement, The Authority System, and Halal Brand Partnership.',
};

const CARDS = [
  {
    eyebrow:  'Web & Brand',
    title:    'Foundations Engagement',
    subtitle: 'For halal brands that need a digital home built to last — not to impress for three months.',
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
      <section className="sec" style={{ background: '#F7F3ED', paddingBottom: '4rem' }}>
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
                  className={`btn svc-card-cta ${card.featured ? 'btn-gold' : 'btn-outline'}`}
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

      {/* ── Why Waheed ── */}
      <section className="sec" style={{ background: '#FFFDF9' }}>
        <div className="cnt">
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow-v2 center reveal">Built different</span>
            <h2 className="svc-section-h reveal delay-1">
              Every engagement is Shariah-compliant by design.
            </h2>
            <p className="svc-section-sub reveal delay-2">
              We only take on two to three clients per quarter — so your project gets the full weight
              of the studio, not a slice of an overloaded team. No interest-based pricing structures,
              no manipulative sales tactics, no compromise on quality or on deen.
            </p>
          </div>

          <div className="svc-why-grid">
            {WHY_ITEMS.map((item, i) => (
              <div key={item.title} className={`svc-why-item reveal delay-${i + 1}`}>
                <span className="svc-why-num">0{i + 1}</span>
                <h4 className="svc-why-title">{item.title}</h4>
                <p className="svc-why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner">
        <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow-v2 center">Ready when you are</span>
          <h2 className="cta-h reveal">
            Apply for a free <em>Discovery Call.</em>
          </h2>
          <p className="cta-p reveal delay-1">
            30 minutes. No pressure. We&apos;ll review your application personally and respond
            within 24 hours, in sha Allah.
          </p>
          <div className="cta-acts reveal delay-2">
            <Link href="/contact" className="btn btn-teal">
              Apply Now →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

const WHY_ITEMS = [
  {
    title: 'Limited Capacity',
    desc:  'Two to three clients per quarter. Your project is never diluted across a hundred others.',
  },
  {
    title: 'Values-Aligned Strategy',
    desc:  'Every recommendation is filtered through Shariah principles — no grey-area tactics, ever.',
  },
  {
    title: 'Transparent Scope',
    desc:  'Strategy and deliverables agreed in writing before a single pixel is drawn or a line coded.',
  },
  {
    title: 'Post-Launch Partnership',
    desc:  'Every engagement includes post-launch support. We do not disappear after go-live.',
  },
] as const;
