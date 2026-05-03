'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

function CategoryChip({ label }: { label: string }) {
  return (
    <span className="font-[var(--font-dm-sans)] text-[10px] uppercase tracking-widest bg-[var(--yellow)] text-[var(--text-dark)] px-3 py-1 rounded-full inline-block mb-3 font-medium">
      {label}
    </span>
  );
}

const FEATURED = {
  cat: 'Web + Development',
  title: 'Modest Fashion E-Commerce Platform',
  excerpt: 'A full-stack Shariah-compliant e-commerce experience — from product catalogue to checkout, built with privacy-first principles.',
};

const SMALL_CARDS = [
  {
    cat: 'Social Media',
    title: 'Islamic Education Centre',
    excerpt: 'Community-first social strategy, zero haram placements.',
  },
  {
    cat: 'Mobile App',
    title: 'Halal Food Discovery App',
    excerpt: 'React Native — helping Muslim families find trusted halal options locally.',
  },
];

export default function HomeWork() {
  return (
    <section className="bg-[#2A4D38] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionTag accent>Our Work</SectionTag>
        <SectionTitle
          light
          className="mt-4 mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}
        >
          Projects built with intention.
        </SectionTitle>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Featured card — col-span-3 */}
          <motion.div variants={fadeUp} className="md:col-span-3">
            <div className="aspect-video bg-[#3D6B4F] rounded-xl mb-4" />
            <CategoryChip label={FEATURED.cat} />
            <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] text-2xl font-light mb-2">
              {FEATURED.title}
            </h3>
            <p className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.65)] text-sm leading-relaxed line-clamp-2 mb-3">
              {FEATURED.excerpt}
            </p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1 font-[var(--font-dm-sans)] text-[var(--yellow)] text-sm hover:gap-2 transition-all"
            >
              View Case Study
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Small cards — col-span-2 */}
          <div className="md:col-span-2 space-y-4">
            {SMALL_CARDS.map((card) => (
              <motion.div key={card.title} variants={fadeUp}>
                <div className="aspect-video bg-[#3D6B4F] rounded-xl mb-4" />
                <CategoryChip label={card.cat} />
                <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] text-xl font-light mb-2">
                  {card.title}
                </h3>
                <p className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.65)] text-sm leading-relaxed line-clamp-2 mb-3">
                  {card.excerpt}
                </p>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-1 font-[var(--font-dm-sans)] text-[var(--yellow)] text-sm hover:gap-2 transition-all"
                >
                  View Case Study
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="font-[var(--font-dm-sans)] text-xs italic text-[rgba(245,240,232,0.4)] text-center mt-8">
          Client names withheld by default — case studies published only with explicit permission.
        </p>
      </div>
    </section>
  );
}
