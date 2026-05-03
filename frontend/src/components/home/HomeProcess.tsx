'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import SectionTitle from '@/components/ui/SectionTitle';

const STEPS = [
  {
    num: '01',
    title: 'Discovery Call',
    body: 'We start with a free conversation. No pitch, no pressure — just honest dialogue to understand your business, your values, and what you actually need.',
    top: '100px',
  },
  {
    num: '02',
    title: 'Proposal & Alignment',
    body: 'We scope the work clearly. Timeline, deliverables, and pricing all transparent upfront. You review, we refine. No surprises, no hidden fees — ever.',
    top: '130px',
  },
  {
    num: '03',
    title: 'Build & Deliver',
    body: 'We execute with ihsan — care, craft, and attention to detail at every step. Regular updates, open communication, and work that holds up to conscience.',
    top: '160px',
  },
];

export default function HomeProcess() {
  return (
    <section className="bg-[var(--cream)] pt-24 md:pt-32">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <SectionTag>The Process</SectionTag>
        <SectionTitle className="mt-4 mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}>
          How we work together
        </SectionTitle>

        {/* Stacking sticky cards */}
        <div>
          {STEPS.map(({ num, title, body, top }) => (
            <div
              key={num}
              className="sticky bg-white border border-[rgba(26,46,34,0.08)] rounded-2xl p-8 md:p-12 mb-2"
              style={{ top }}
            >
              <p className="font-[var(--font-cormorant)] text-[var(--yellow)] font-light leading-none mb-4"
                 style={{ fontSize: '5rem' }}>
                {num}
              </p>
              <h3 className="font-[var(--font-cormorant)] text-[var(--text-dark)] text-3xl font-light mb-4">
                {title}
              </h3>
              <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-sm leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Spacer so all cards are visible */}
        <div className="pb-32" />

        {/* CTA */}
        <motion.div
          className="text-center pb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <Link
            href="/contact"
            className="font-[var(--font-dm-sans)] font-medium bg-[var(--yellow)] text-[var(--text-dark)] px-8 py-3.5 rounded-full hover:bg-[#f0d46a] transition-colors duration-200 text-sm inline-block"
          >
            Start with a Free Call
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
