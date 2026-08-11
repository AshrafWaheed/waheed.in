'use client';

/**
 * AppPhone — the App Development page rendered as one tall mobile screen.
 *
 * The whole page is a phone: a sticky status bar with a dynamic island up top,
 * then the service's argument restyled as native app UI you scroll top-to-bottom
 * — an onboarding hero, alert cards, a feature list, an install stepper, a
 * results checklist, plans, an FAQ accordion and a CTA — closed by the home
 * indicator. Modern, light app surface on a dark stage. Copy is `page` (verbatim
 * app-development.ts); only the section framings are new.
 */
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Compass, Palette, Smartphone, Bell, Server, Rocket,
  Check, ChevronDown, ArrowRight, Wifi, BatteryFull, Star, Package,
} from 'lucide-react';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.6, ease: EASE },
};

const FEATURE_ICONS = [Compass, Palette, Smartphone, Bell, Server, Rocket];

/** A three-bar signal glyph (lucide has no clean one at this weight). */
function Signal() {
  return (
    <svg className="md-sysicon" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5" width="3" height="7" rx="1" />
      <rect x="10" y="2" width="3" height="10" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`md-faq${open ? ' is-open' : ''}`}>
      <button type="button" className="md-faq-q" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <ChevronDown className="md-faq-chev" size={18} />
      </button>
      <div className="md-faq-a"><p>{a}</p></div>
    </div>
  );
}

export default function AppPhone({ page }: { page: ServicePage }) {
  const { hero, problem, build, process, outcomes, packages, faq, cta } = page;

  return (
    <section className="md-stage" data-section-color="dark">
      <div className="md-frame">
        {/* ── Status bar + dynamic island ─────────────────────────────────── */}
        <div className="md-status">
          <span className="md-time">9:41</span>
          <span className="md-island" aria-hidden="true" />
          <span className="md-sysicons" aria-hidden="true">
            <Signal />
            <Wifi className="md-sysicon" size={15} strokeWidth={2.4} />
            <BatteryFull className="md-sysicon" size={22} strokeWidth={1.6} />
          </span>
        </div>

        <div className="md-screen">
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <motion.header className="md-hero" {...reveal}>
            <span className="md-appicon"><Smartphone size={30} strokeWidth={2} /></span>
            <p className="md-hero-kicker">{hero.h1.lead} {hero.h1.em}</p>
            <h1 className="md-hero-title">An app people <em>reopen.</em></h1>
            <p className="md-hero-sub">{hero.sub}</p>
            <div className="md-hero-acts">
              <Link href="/contact" className="md-btn md-btn--primary" data-cursor>
                Book a free clarity call <ArrowRight size={16} />
              </Link>
              <Link href="/packages" className="md-btn md-btn--ghost" data-cursor>See the packages</Link>
            </div>
            <div className="md-chips">
              <span className="md-chip">iOS</span>
              <span className="md-chip">Android</span>
              <span className="md-chip">One codebase</span>
            </div>
          </motion.header>

          {/* ── Problem — alerts ──────────────────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">Why an app</p>
            <h2 className="md-h2">{problem.heading.lead} <em>{problem.heading.em}</em></h2>
            <div className="md-alerts">
              {problem.symptoms.map((s) => (
                <div key={s.title} className="md-alert">
                  <span className="md-alert-i"><AlertTriangle size={17} strokeWidth={2.2} /></span>
                  <div>
                    <p className="md-alert-t">{s.title}</p>
                    <p className="md-alert-b">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Build — feature list ──────────────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">What we build</p>
            <h2 className="md-h2">{build.heading}</h2>
            <div className="md-features">
              {build.items.map((it, i) => {
                const Icon = FEATURE_ICONS[i] ?? Compass;
                return (
                  <div key={it.num} className="md-feature">
                    <span className="md-feature-i"><Icon size={19} strokeWidth={2} /></span>
                    <div className="md-feature-tx">
                      <p className="md-feature-t">{it.title}</p>
                      <p className="md-feature-b">{it.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ── Process — install stepper ─────────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">How it ships</p>
            <h2 className="md-h2">{process.heading}</h2>
            <ol className="md-steps">
              {process.steps.map((st, i) => (
                <li key={st.title} className="md-step">
                  <span className="md-step-node">{i + 1}</span>
                  <div className="md-step-tx">
                    <span className="md-step-span">{st.span}</span>
                    <p className="md-step-t">{st.title}</p>
                    <p className="md-step-b">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* ── Outcomes — results checklist ──────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">What you get</p>
            <h2 className="md-h2">{outcomes.heading.lead} <em>{outcomes.heading.em}</em></h2>
            <div className="md-card md-check">
              {outcomes.list.map((l, i) => (
                <p key={i} className="md-check-i"><span className="md-check-b"><Check size={14} strokeWidth={3} /></span>{l}</p>
              ))}
            </div>
            <div className="md-fitrow">
              <div className="md-fit md-fit--yes">
                <p className="md-fit-h">{outcomes.fitHeading}</p>
                <ul>{outcomes.fit.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>
              <div className="md-fit md-fit--no">
                <p className="md-fit-h">{outcomes.notHeading}</p>
                <ul>{outcomes.not.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>
            </div>
          </motion.section>

          {/* ── Packages — plans ──────────────────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">Where this sits</p>
            <h2 className="md-h2">The plans that include it.</h2>
            <div className="md-plans">
              {packages.map((name) => (
                <Link key={name} href="/packages" className="md-plan" data-cursor>
                  <span className="md-plan-i"><Package size={18} strokeWidth={2} /></span>
                  <span className="md-plan-t">{name}</span>
                  <ArrowRight className="md-plan-arr" size={16} />
                </Link>
              ))}
            </div>
          </motion.section>

          {/* ── FAQ ───────────────────────────────────────────────────────── */}
          <motion.section className="md-sec" {...reveal}>
            <p className="md-label">Before you ask</p>
            <h2 className="md-h2">Questions, answered.</h2>
            <div className="md-faqs">
              {faq.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </motion.section>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <motion.section className="md-sec md-cta-sec" {...reveal}>
            <div className="md-cta">
              <span className="md-cta-stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></span>
              <h2 className="md-cta-h">{cta.heading.lead} <em>{cta.heading.em}</em></h2>
              <p className="md-cta-b">{cta.body}</p>
              <Link href="/contact" className="md-btn md-btn--primary md-btn--full" data-cursor>
                Book a free clarity call <ArrowRight size={16} />
              </Link>
            </div>
          </motion.section>
        </div>

        <div className="md-home" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
