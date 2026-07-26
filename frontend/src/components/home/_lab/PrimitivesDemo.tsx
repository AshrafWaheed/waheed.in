'use client';

/**
 * Session 0 smoke test — exercises every foundation primitive on one page so we
 * can verify the shared system in-browser. Each variant route renders this until
 * its real sections are built (S1–S6), at which point it's replaced.
 */
import Link from 'next/link';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import SplitReveal from '@/components/motion/SplitReveal';
import { DrawPath } from '@/components/motion/StrokeDraw';
import Magnetic from '@/components/motion/Magnetic';
import Spotlight from '@/components/motion/Spotlight';
import Marquee from '@/components/motion/Marquee';
import Khatam from '@/components/graphics/Khatam';
import { trustItems } from '@/content/home';

const eyebrow: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-sans)',
  fontSize: '.72rem',
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--rd-gold-line)',
  marginBottom: '1rem',
};

export default function PrimitivesDemo({ variant }: { variant: string }) {
  return (
    <>
      <KhatamCursor />
      <SectionNav />

      {/* ── Dark hero: engine (stroke-draw + khatam) + split reveal + magnetic ── */}
      <section
        data-section-color="dark"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '7rem 1.5rem',
          overflow: 'hidden',
          background: 'radial-gradient(120% 90% at 50% 0%, #1c3d47 0%, var(--rd-night) 60%)',
          color: 'var(--rd-on-night)',
        }}
      >
        {/* self-drawing Barakah-engine sketch */}
        <svg
          viewBox="0 0 400 400"
          fill="none"
          stroke="var(--rd-gold-line)"
          strokeLinecap="round"
          aria-hidden="true"
          style={{ position: 'absolute', width: 'min(78vh, 620px)', opacity: 0.45 }}
        >
          <DrawPath d="M200 44 a156 156 0 1 0 0.1 0" strokeWidth={1} duration={2.4} trigger="mount" />
          <DrawPath d="M200 92 a108 108 0 1 0 0.1 0" strokeWidth={1} duration={2.2} delay={0.2} trigger="mount" />
          <g style={{ transformOrigin: '200px 200px', animation: 'rd-spin 60s linear infinite' }}>
            <Khatam size={400} points={8} inner={0.42} stroke="var(--rd-gold-line)" strokeWidth={0.7} />
          </g>
          <g style={{ transformOrigin: '200px 200px', animation: 'rd-spin 40s linear infinite reverse' }}>
            <Khatam size={400} points={8} inner={0.42} stroke="var(--rd-gold-line)" strokeWidth={0.5} style={{ transform: 'rotate(22.5deg)', transformOrigin: 'center' }} />
          </g>
        </svg>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900 }}>
          <span style={eyebrow}>Foundation lab · {variant}</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
              fontWeight: 500,
              lineHeight: 1.04,
              margin: '0.5rem 0 1.2rem',
            }}
          >
            <SplitReveal text="The Barakah Engine" by="char" trigger="mount" stagger={0.04} />
          </h1>
          <p style={{ color: 'var(--rd-on-night-dim)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2.2rem' }}>
            Primitive smoke test — khatam cursor, split reveal, stroke-draw, magnetic, spotlight, marquee, section-aware nav.
          </p>
          <Magnetic strength={0.4}>
            <Link href="/contact" className="btn btn-gold" data-cursor>
              Magnetic CTA →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background: 'var(--rd-night-2)', color: 'var(--rd-gold-bloom)', padding: '1.15rem 0' }}>
        <Marquee speed={28}>
          {trustItems.map((t) => (
            <span
              key={t}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.4rem',
                padding: '0 1.4rem',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                fontStyle: 'italic',
              }}
            >
              {t}
              <Khatam size={11} stroke="var(--rd-gold-line)" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Light section: spotlight cards ── */}
      <section data-section-color="light" style={{ background: 'var(--rd-ivory)', padding: '6.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--rd-teal)', marginBottom: '2rem' }}>
            <SplitReveal text="Spotlight + hairline geometry" by="word" />
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[0, 1, 2].map((i) => (
              <Spotlight key={i} style={{ borderRadius: 16 }}>
                <div
                  style={{
                    border: '1px solid var(--rd-hairline)',
                    borderRadius: 16,
                    padding: '2rem',
                    background: 'var(--rd-white)',
                    minHeight: 210,
                  }}
                >
                  <Khatam size={34} stroke="var(--rd-gold)" ring />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--rd-teal)', margin: '1rem 0 .5rem' }}>
                    Spotlight card {i + 1}
                  </h3>
                  <p style={{ fontSize: '.95rem', color: '#5a6b6f' }}>Hover me — the gold glow tracks your cursor.</p>
                </div>
              </Spotlight>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
