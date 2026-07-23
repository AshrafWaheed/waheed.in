import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Services · WAHEED',
  description:
    'Five packages built for halal brands: Halal Brand Audit, Foundations Engagement, The Authority System, Halal Brand OS, and Halal Brand Partnership.',
  path: '/services',
});

const CARDS = [
  {
    eyebrow:  'Diagnostic',
    title:    'Halal Brand Audit',
    subtitle: 'A clear-eyed read on your brand, before you commit to a build.',
    desc:     "A review of your current site, delivered as a personalised report plus a 60-90-minute strategy call. You walk away knowing exactly what's costing you sales and what to fix first.",
    featured: false,
    badge:    null,
    delay:    'delay-1',
  },
  {
    eyebrow:  'Web & Brand',
    title:    'Foundations Engagement',
    subtitle: 'For halal brands that want their sites to actually convert.',
    desc:     'Full website + brand foundations + 30-day post-launch optimisation, with weekly check-ins on progress. Conversion-fluent, mobile-first, built on a system you can grow into.',
    featured: false,
    badge:    null,
    delay:    'delay-2',
  },
  {
    eyebrow:  'Full System',
    title:    'The Authority System',
    subtitle: 'Full website + brand system + 90-day social ramp. For founders ready to be taken seriously.',
    desc:     'Everything in Foundations, plus brand identity refresh, content strategy, social ramp-up, monthly reviews, and weekly check-ins.',
    featured: true,
    badge:    'Most Requested',
    delay:    'delay-3',
  },
  {
    eyebrow:  'Custom Build',
    title:    'Halal Brand OS',
    subtitle: 'For education platforms and scaling brands that need a website with real systems underneath it.',
    desc:     'Custom software or platform, full brand system, and six months of hands-on strategic partnership. Built for founders whose next stage of growth depends on something no template can hold.',
    featured: false,
    badge:    null,
    delay:    'delay-4',
  },
  {
    eyebrow:  'Partnership',
    title:    'Halal Brand Partnership',
    subtitle: 'Continuous build and monthly strategy reviews. For brands that need an ongoing partner, not a vendor.',
    desc:     'Monthly retainer covering iterative design, growth experiments, technical maintenance, and strategic counsel.',
    featured: false,
    badge:    null,
    delay:    'delay-5',
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
            The Framework halal brands are{' '}
            <em>built on.</em>
          </h1>
          <p>Packages that are strategically crafted to move the business forward.</p>
        </div>
      </div>

      {/* ── Offer Ladder ── */}
      <section className="sec" style={{ background: '#F7F3ED' }}>
        <div className="cnt">
          <div className="svc-grid svc-grid--wrap" style={{ marginTop: 0 }}>
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
              <h3 className="svc-custom-h">Request a custom package.</h3>
              <p className="svc-custom-p">
                Tell us the problems that frustrate you, your goals, your budget, and where you
                are right now. We&apos;ll put together a curated scope that fits.
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
