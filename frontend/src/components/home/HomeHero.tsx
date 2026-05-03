'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, TrendingUp, BookOpen } from 'lucide-react';
import IslamicGeometry from '@/components/ui/IslamicGeometry';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WORDS = ['Success', 'does', 'not', 'require', 'disobedience.'];

const CARDS = [
  {
    icon: Code2,
    title: 'Web, Mobile & Software',
    desc: 'Shariah-conscious digital products.',
    duration: 4,
    delay: 0,
  },
  {
    icon: TrendingUp,
    title: 'Social Media Marketing',
    desc: 'Ethical strategies that build trust.',
    duration: 5,
    delay: 0.8,
  },
  {
    icon: BookOpen,
    title: 'Halal Business Coaching',
    desc: 'Growth aligned with your faith.',
    duration: 4.5,
    delay: 1.6,
  },
];

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#2A4D38] overflow-hidden flex items-center"
    >
      {/* Islamic geometry decoration */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <IslamicGeometry size={680} opacity={0.05} />
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 pointer-events-none">
        <IslamicGeometry size={480} opacity={0.03} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center min-h-screen">
          {/* Left column */}
          <div>
            {/* Bismillah */}
            <motion.p
              className="font-[var(--font-amiri)] text-[var(--cream)] opacity-60 text-sm mb-4 text-right md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              lang="ar"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            {/* Tag */}
            <motion.p
              className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-xs uppercase tracking-widest mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              — India&apos;s First Halal Digital Studio
            </motion.p>

            {/* H1 — word by word */}
            <h1
              className="font-[var(--font-cormorant)] italic font-light text-[var(--cream)] leading-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 6.5vw, 6rem)' }}
            >
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden mr-[0.25em] last:mr-0"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + i * 0.08,
                      ease: EASE_OUT,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.7)] max-w-lg leading-relaxed text-base"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
            >
              We help Muslim-led brands grow online — with web development, ethical marketing, and purpose-driven coaching, all aligned with Islamic values.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT }}
            >
              <Link
                href="/contact"
                className="font-[var(--font-dm-sans)] font-medium bg-[var(--yellow)] text-[var(--text-dark)] px-7 py-3 rounded-full hover:bg-[#f0d46a] transition-colors duration-200 text-sm"
              >
                Book a Free Consultation
              </Link>
              <Link
                href="/services"
                className="font-[var(--font-dm-sans)] text-[var(--cream)] border border-[rgba(245,240,232,0.4)] px-7 py-3 rounded-full hover:border-[rgba(245,240,232,0.7)] transition-colors duration-200 text-sm"
              >
                Explore Services
              </Link>
            </motion.div>
          </div>

          {/* Right column — floating service cards (desktop only) */}
          <div className="hidden md:flex flex-col gap-4">
            {CARDS.map(({ icon: Icon, title, desc, duration, delay }, i) => (
              <motion.div
                key={i}
                className="bg-[#3D6B4F] border border-[#4a7a5f] rounded-2xl p-5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.2 + i * 0.15, ease: EASE_OUT }}
                style={{
                  animation: `floatCard${i} ${duration}s ease-in-out ${delay}s infinite`,
                }}
              >
                <Icon size={20} className="text-[var(--yellow)] mb-3" />
                <p className="font-[var(--font-dm-sans)] font-medium text-[var(--cream)] text-sm mb-1">
                  {title}
                </p>
                <p className="font-[var(--font-dm-sans)] text-xs text-[rgba(245,240,232,0.6)]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5 }}
      >
        <p className="font-[var(--font-dm-sans)] text-xs tracking-widest text-[rgba(245,240,232,0.4)] uppercase">
          Scroll
        </p>
        <motion.div
          className="w-px h-8 bg-[rgba(245,240,232,0.2)]"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>

      <style>{`
        @keyframes floatCard0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatCard1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatCard2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>
    </section>
  );
}
