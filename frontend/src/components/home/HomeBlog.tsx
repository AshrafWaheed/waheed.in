'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import SectionTitle from '@/components/ui/SectionTitle';
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

const POSTS = [
  {
    cat: 'Marketing Ethics',
    date: 'March 2026',
    title: 'Why We Refuse Viral Tactics — and What We Do Instead',
    excerpt: 'A clear-eyed look at why manufactured virality contradicts the Ihsan standard — and the ethical alternative we build campaigns around.',
  },
  {
    cat: 'Web Development',
    date: 'February 2026',
    title: 'The True Cost of a Cheap Website',
    excerpt: 'Templated sites and overnight freelancers leave you exposed — technically and ethically. What intentional development looks like.',
  },
  {
    cat: 'Business Coaching',
    date: 'January 2026',
    title: 'ISLAMify Your Business — In Practice',
    excerpt: 'Beyond halal labelling — a framework for embedding Islamic values into every decision, from pricing to your about page.',
  },
];

export default function HomeBlog() {
  return (
    <section className="bg-[#2A4D38] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionTag accent>Perspectives</SectionTag>
        <SectionTitle
          light
          className="mt-4 mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}
        >
          Thinking out loud on faith, business &amp; the web.
        </SectionTitle>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {POSTS.map(({ cat, date, title, excerpt }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="bg-[#3D6B4F] rounded-2xl p-6 border border-[rgba(245,240,232,0.08)]"
            >
              <span className="font-[var(--font-dm-sans)] text-[10px] uppercase tracking-widest border border-[rgba(245,240,232,0.2)] text-[rgba(245,240,232,0.7)] px-3 py-1 rounded-full inline-block mb-3">
                {cat}
              </span>
              <p className="font-[var(--font-dm-sans)] text-xs text-[rgba(245,240,232,0.4)] mb-3">{date}</p>
              <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] text-xl font-light leading-snug mb-3">
                {title}
              </h3>
              <p className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.6)] leading-relaxed line-clamp-3 mb-4">
                {excerpt}
              </p>
              <Link href="/blog" className="font-[var(--font-dm-sans)] text-[var(--yellow)] text-sm hover:underline">
                Read →
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.7)] border border-[rgba(245,240,232,0.3)] px-7 py-3 rounded-full hover:text-[var(--cream)] hover:border-[var(--cream)] transition-colors duration-200 inline-block"
          >
            Visit the Journal →
          </Link>
        </div>
      </div>
    </section>
  );
}
