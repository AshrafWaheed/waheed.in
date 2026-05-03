'use client';
import { motion } from 'framer-motion';
import { Shield, Eye, Heart } from 'lucide-react';
import SectionTag from '@/components/ui/SectionTag';
import type { Variants } from 'framer-motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

const CARDS = [
  {
    icon: Shield,
    title: 'Ethics Before Everything',
    body: 'Principles before profit. We ask hard questions before writing a single line of code or crafting a single post.',
  },
  {
    icon: Eye,
    title: 'Radical Transparency',
    body: 'No hidden fees. No vague proposals. No surprises at the end. You know exactly what you are getting and what it costs — upfront.',
  },
  {
    icon: Heart,
    title: 'Built for Barakah',
    body: 'We measure success by clean earnings, clear conscience, and trust earned. If growth costs integrity, it is not growth.',
  },
];

export default function HomePhilosophy() {
  return (
    <section className="bg-[var(--cream)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left sticky column */}
          <div className="md:sticky md:top-28 md:self-start">
            <SectionTag>Our Approach</SectionTag>
            <h2
              className="font-[var(--font-cormorant)] font-light text-[var(--text-dark)] leading-tight mt-6"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
            >
              We don&apos;t just build.
              <br />
              We build with
              <br />
              <em className="italic text-[var(--yellow)]">intention.</em>
            </h2>
            <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-sm leading-relaxed mt-6 max-w-sm">
              Every project begins with a question: does this serve a real need, respect the user, and hold up to accountability before Allah?
            </p>
          </div>

          {/* Right scrolling cards */}
          <div>
            {CARDS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={i}
                className="bg-white border border-[rgba(26,46,34,0.08)] rounded-2xl p-8 mb-6 last:mb-0"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15 }}
              >
                <Icon size={24} className="text-[var(--yellow)] mb-4" />
                <h3 className="font-[var(--font-cormorant)] text-[var(--text-dark)] text-xl font-medium mb-2">
                  {title}
                </h3>
                <p className="font-[var(--font-dm-sans)] text-sm text-[var(--text-light)] leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
