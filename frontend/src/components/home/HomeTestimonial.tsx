'use client';
import { motion } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import type { Variants } from 'framer-motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const SMALL_CARDS = [
  {
    quote: "They told us upfront what they wouldn't do — and that gave us more confidence than any portfolio. Our website now reflects who we actually are.",
    name: 'Ibrahim K.',
    role: 'CEO, Halal Food Co.',
    initials: 'IK',
  },
  {
    quote: "The coaching programme helped me think clearly about what growth actually means within my deen. It changed how I approach every business decision.",
    name: 'Aisha M.',
    role: 'Independent Consultant',
    initials: 'AM',
  },
  {
    quote: "Clear pricing, honest timelines, and they pushed back when our brief conflicted with our own values. That integrity is rare.",
    name: 'Mohammed H.',
    role: 'Director, Al-Amal Group',
    initials: 'MH',
  },
];

export default function HomeTestimonial() {
  return (
    <section className="bg-[var(--cream)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionTag>Kind Words</SectionTag>

        {/* Featured testimonial */}
        <motion.div
          className="relative text-center max-w-4xl mx-auto mb-20 mt-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE_OUT }}
        >
          {/* Large quote mark */}
          <span
            className="font-[var(--font-cormorant)] text-[var(--yellow)] absolute top-0 left-0 leading-none pointer-events-none select-none"
            style={{ fontSize: '8rem', opacity: 0.3 }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote className="font-[var(--font-cormorant)] italic font-light text-[var(--text-dark)] leading-relaxed pt-12 relative z-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            WAHEED didn&apos;t just build us a website — they asked questions no other agency asked. They wanted to understand our values before our brief. The result was a presence we are genuinely proud of.
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--green-dark)] flex items-center justify-center shrink-0">
              <span className="font-[var(--font-cormorant)] text-[var(--cream)] text-lg">FA</span>
            </div>
            <div className="text-left">
              <p className="font-[var(--font-dm-sans)] font-medium text-[var(--text-dark)] text-sm">Fatima R.</p>
              <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-xs">Founder, Modest Fashion Brand</p>
            </div>
          </div>
        </motion.div>

        {/* 3 smaller cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {SMALL_CARDS.map(({ quote, name, role, initials }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="bg-white border border-[rgba(26,46,34,0.08)] rounded-2xl p-8"
            >
              <span
                className="font-[var(--font-cormorant)] text-[var(--yellow)] leading-none block mb-4"
                style={{ fontSize: '3rem' }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <blockquote className="font-[var(--font-cormorant)] italic text-[var(--text-dark)] text-lg leading-relaxed mb-6">
                {quote}
              </blockquote>
              <hr className="border-[rgba(26,46,34,0.08)] mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--green-dark)] flex items-center justify-center shrink-0">
                  <span className="font-[var(--font-cormorant)] text-[var(--cream)] text-sm">{initials}</span>
                </div>
                <div>
                  <p className="font-[var(--font-dm-sans)] font-medium text-[var(--text-dark)] text-sm">{name}</p>
                  <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-xs">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
