"use client";

import { motion, type Variants } from "framer-motion";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Testimonial {
  quote:    string;
  name:     string;
  role:     string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:    "Waheed didn't just build us a website — they built us a presence we're proud to put our name behind. No shortcuts, no compromises.",
    name:     "Fatima R.",
    role:     "Founder, Modest Fashion Brand",
    initials: "FR",
  },
  {
    quote:    "Our social media went from zero engagement to a real community in under six months. The strategy was ethical, the growth was real.",
    name:     "Ibrahim K.",
    role:     "CEO, Halal Food Co.",
    initials: "IK",
  },
  {
    quote:    "The clarity session changed how I price and position my consultancy. I left with conviction, not just a plan.",
    name:     "Aisha M.",
    role:     "Director, Muslim-led Consultancy",
    initials: "AM",
  },
];

const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const cardContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      variants={cardVariant}
      className="flex flex-col bg-white rounded-xl p-8 shadow-sm border border-[var(--cream-dark)] h-full"
    >
      {/* Large opening quote mark */}
      <span
        className="font-[var(--font-cormorant)] text-[var(--yellow)] leading-none mb-4 select-none"
        style={{ fontSize: "4rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote */}
      <blockquote className="font-[var(--font-cormorant)] italic text-[var(--text-dark)] text-xl leading-relaxed flex-1 mb-6">
        {t.quote}
      </blockquote>

      {/* Divider */}
      <div className="w-12 h-px bg-[var(--cream-dark)] mb-6" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-[#2A4D38] flex items-center justify-center shrink-0">
          <span className="font-[var(--font-dm-sans)] text-xs font-bold text-[var(--cream)] tracking-wide">
            {t.initials}
          </span>
        </div>
        <div>
          <p className="font-[var(--font-dm-sans)] font-semibold text-sm text-[var(--text-dark)]">
            {t.name}
          </p>
          <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-light)]">
            {t.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[var(--cream)] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag className="mb-4">Kind Words</SectionTag>
          <SectionTitle className="text-4xl md:text-5xl">
            What our{" "}
            <em className="not-italic italic text-[var(--green)]">clients say</em>
          </SectionTitle>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.initials} t={t} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
