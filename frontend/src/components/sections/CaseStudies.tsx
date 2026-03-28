"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CaseStudy {
  category: string;
  title:    string;
  excerpt:  string;
  href:     string;
}

const FEATURED: CaseStudy = {
  category: "Web Development",
  title:    "Building a halal e-commerce platform for a modest fashion brand",
  excerpt:  "A full Next.js storefront with Shariah-compliant payment flows and ethical UX — no dark patterns, no pressure tactics.",
  href:     "/work/halal-ecommerce",
};

const SECONDARY: CaseStudy[] = [
  {
    category: "Social Media",
    title:    "Growing a halal food brand's community by 300% in 4 months",
    excerpt:  "Ethical content strategy focused on education and trust.",
    href:     "/work/halal-food-brand",
  },
  {
    category: "Coaching",
    title:    "Helping a Muslim-led consultancy reposition and reprice",
    excerpt:  "Clarity session that led to a 40% increase in project value.",
    href:     "/work/consultancy-coaching",
  },
];

// ─── Animation variants ──────────────────────────────────────
const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const gridContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const gridItem: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

// ─── Sub-components ──────────────────────────────────────────
function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-block bg-[var(--yellow)] text-[var(--text-dark)] font-[var(--font-dm-sans)] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm leading-none"
      style={{ fontSize: "0.65rem" }}>
      {label}
    </span>
  );
}

function CaseStudyCard({
  study,
  featured = false,
}: {
  study: CaseStudy;
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={gridItem}
      className="group flex flex-col bg-[#3D6B4F] rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 ease-out h-full"
    >
      {/* Image placeholder */}
      <div
        className={[
          "relative bg-gradient-to-br from-[#2a4d38] to-[#4a7a5f] shrink-0",
          featured ? "aspect-[4/3]" : "aspect-video",
        ].join(" ")}
      >
        {/* Subtle inner texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        {/* Category chip */}
        <div className="absolute top-4 left-4">
          <CategoryChip label={study.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className={[
            "font-[var(--font-cormorant)] font-semibold text-[var(--cream)] leading-tight mb-3",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          ].join(" ")}
        >
          {study.title}
        </h3>

        <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] leading-relaxed mb-5 flex-1">
          {study.excerpt}
        </p>

        <a
          href={study.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--yellow)] hover:text-[var(--yellow-soft)] transition-colors duration-200"
        >
          View Case Study
          <ArrowRight
            size={13}
            strokeWidth={2}
            className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
          />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────
export default function CaseStudies() {
  return (
    <section id="work" className="bg-[#2A4D38] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag accent className="mb-4">Our Work</SectionTag>
          <SectionTitle light className="text-4xl md:text-5xl">
            Projects built with{" "}
            <em className="not-italic italic text-[var(--yellow)]">intention</em>
          </SectionTitle>
        </motion.div>

        {/* ── Asymmetric grid ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Featured — 60% */}
          <div className="lg:col-span-3">
            <CaseStudyCard study={FEATURED} featured />
          </div>

          {/* Secondary stack — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {SECONDARY.map((study) => (
              <CaseStudyCard key={study.href} study={study} />
            ))}
          </div>
        </motion.div>

        {/* ── Discretion note ── */}
        <motion.p
          className="mt-10 text-center font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Client names withheld — case studies published with permission only.
        </motion.p>

      </div>
    </section>
  );
}
