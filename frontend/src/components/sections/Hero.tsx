"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Code2, TrendingUp, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionTag from "@/components/ui/SectionTag";
import ArabicText from "@/components/ui/ArabicText";
import IslamicGeometry from "@/components/ui/IslamicGeometry";

// ─── Animation variants ──────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const cardsContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.85 } },
};

const cardItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

// ─── Service cards ────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    icon: Code2,
    title: "Web, Mobile & Software",
    description: "Shariah-conscious digital products built to perform.",
    floatClass: "animate-float",
  },
  {
    icon: TrendingUp,
    title: "Social Media Marketing",
    description: "Ethical strategies that build trust, not pressure.",
    floatClass: "animate-float-delayed",
  },
  {
    icon: BookOpen,
    title: "Halal Business Coaching",
    description: "Growth aligned with your faith and values.",
    floatClass: "animate-float-delayed-2",
  },
] as const;

// ─── Component ───────────────────────────────────────────────
export default function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? "visible" : "hidden";

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#2A4D38] overflow-hidden flex flex-col"
    >
      {/* ── Islamic geometry — top-right, z-0 ── */}
      <div
        className="absolute top-0 right-0 z-0 pointer-events-none select-none translate-x-1/4 -translate-y-1/4"
        aria-hidden="true"
      >
        <IslamicGeometry size={680} color="#F5F0E8" opacity={0.06} />
      </div>

      {/* ── Islamic geometry echo — bottom-left, z-0 ── */}
      <div
        className="absolute bottom-0 left-0 z-0 pointer-events-none select-none -translate-x-1/4 translate-y-1/4"
        aria-hidden="true"
      >
        <IslamicGeometry size={500} color="#F5F0E8" opacity={0.04} />
      </div>

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-12"
        variants={container}
        initial={initial}
        animate="visible"
      >
        {/* Bismillah */}
        <motion.div variants={item} className="mb-6">
          <ArabicText size="2xl" opacity={0.65} className="text-[var(--cream)] tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </ArabicText>
        </motion.div>

        {/* Section tag */}
        <motion.div variants={item} className="mb-5">
          <SectionTag light className="justify-center">
            India&apos;s First Halal Digital Studio
          </SectionTag>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={item}
          className="font-[var(--font-cormorant)] text-[var(--cream)] font-bold italic leading-[1.08] max-w-4xl mb-6"
          style={{ fontSize: "clamp(3rem, 6.5vw, 6rem)" }}
        >
          Success does not require disobedience.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="font-[var(--font-dm-sans)] text-[var(--cream)]/70 text-base md:text-lg leading-relaxed max-w-2xl mb-10"
        >
          We help Muslim-led brands grow online through Shariah-compliant web
          development, ethical social media marketing, and purpose-driven
          business coaching.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
          <Button href="#contact" variant="primary" size="lg">
            Book a Free Consultation
          </Button>
          <Button href="#services" variant="outline" size="lg">
            Explore Services
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Floating service cards ── */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        variants={cardsContainer}
        initial={initial}
        animate="visible"
      >
        {SERVICE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={cardItem}
              className={[
                card.floatClass,
                "bg-[#1e3b2a] border border-[var(--green)]/40 rounded-lg p-5",
                "flex items-start gap-4 hover:border-[var(--green)] transition-colors duration-300",
              ].join(" ")}
            >
              <div className="shrink-0 w-10 h-10 rounded-md bg-[var(--green)] flex items-center justify-center">
                <Icon size={18} className="text-[var(--cream)]" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-[var(--font-dm-sans)] font-semibold text-[var(--cream)] text-sm mb-1 tracking-wide">
                  {card.title}
                </h3>
                <p className="font-[var(--font-dm-sans)] text-[var(--cream)]/55 text-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Scroll hint ── */}
      <div className="relative z-10 flex justify-center pb-6">
        <motion.div
          className="flex flex-col items-center gap-1.5 text-[var(--cream)]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-[var(--font-dm-sans)]">
            Scroll
          </span>
          <motion.span
            className="block w-px h-6 bg-[var(--cream)]/30"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}
