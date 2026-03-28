"use client";

import { motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PILLARS = [
  {
    title: "Ethics First",
    desc:  "Principles before profit, always.",
  },
  {
    title: "Transparent",
    desc:  "No hidden fees, no false promises.",
  },
  {
    title: "Long-term",
    desc:  "We build for barakah, not quick wins.",
  },
  {
    title: "Accountable",
    desc:  "We answer to more than the client.",
  },
] as const;

// Left panel slides in from left
const leftVariants: Variants = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};

// Right panel slides in from right
const rightVariants: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_OUT, delay: 0.18 } },
};

const pillarsContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};

const pillarItem: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export default function WhatWeDo() {
  return (
    <section id="about" className="bg-[#2A4D38] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">

          {/* ── Left — copy ── */}
          <motion.div
            className="w-full lg:w-[55%]"
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Tag */}
            <SectionTag accent className="mb-5">
              Our Approach
            </SectionTag>

            {/* Title */}
            <SectionTitle
              light
              className="text-4xl md:text-5xl mb-6 max-w-lg"
            >
              We don&apos;t just build.{" "}
              <em className="not-italic italic text-[var(--yellow)]">
                We build with intention.
              </em>
            </SectionTitle>

            {/* Body copy */}
            <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-base leading-[1.8] max-w-lg mb-10">
              Every project at WAHEED begins with a question: does this serve a
              real need, respect the user, and hold up to accountability before
              Allah? Technology is not neutral. What we build shapes behaviour.
            </p>

            {/* 4 pillars — 2×2 grid */}
            <motion.div
              className="grid grid-cols-2 gap-x-8 gap-y-7"
              variants={pillarsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {PILLARS.map((pillar) => (
                <motion.div key={pillar.title} variants={pillarItem}>
                  {/* Star + title row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[var(--yellow)] leading-none select-none shrink-0"
                      style={{ fontSize: "0.75rem" }}
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                    <h4 className="font-[var(--font-dm-sans)] font-semibold text-[var(--cream)] text-sm tracking-wide">
                      {pillar.title}
                    </h4>
                  </div>
                  {/* Description */}
                  <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-xs leading-relaxed pl-[1.25rem]">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right — video placeholder ── */}
          <motion.div
            className="w-full lg:w-[45%] flex flex-col"
            variants={rightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* 16:9 placeholder */}
            <div className="relative w-full aspect-video bg-[#3D6B4F] rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer">
              {/* Subtle inner pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />

              {/* Play button */}
              <button
                className="relative z-10 w-16 h-16 rounded-full bg-[var(--yellow)] flex items-center justify-center group-hover:bg-[var(--yellow-soft)] group-hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yellow)] focus-visible:ring-offset-2"
                aria-label="Play — What is WAHEED?"
              >
                <Play
                  size={22}
                  className="text-[var(--text-dark)] ml-0.5"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </button>

              {/* Corner label */}
              <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] font-[var(--font-dm-sans)] text-[var(--cream)]/30 select-none">
                02:47
              </span>
            </div>

            {/* Caption */}
            <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-sm text-center mt-4 tracking-wide">
              Watch —{" "}
              <span className="text-[var(--cream)]/60 italic font-[var(--font-cormorant)] text-base">
                What is WAHEED?
              </span>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
