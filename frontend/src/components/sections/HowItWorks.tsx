"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    num:   "01",
    title: "Discovery Call",
    desc:  "We start with a free consultation to understand your business, goals, and values. No pressure, no pitch — just honest conversation.",
  },
  {
    num:   "02",
    title: "Proposal & Alignment",
    desc:  "We scope the work clearly — timeline, deliverables, and pricing all transparent upfront. No surprises, no hidden fees.",
  },
  {
    num:   "03",
    title: "Build & Deliver",
    desc:  "We execute with ihsan — attention to detail, regular updates, and work that holds up to conscience and craft.",
  },
] as const;

const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const stepsContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const stepVariant: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

const ctaVariant: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="process" className="bg-[var(--cream)] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag className="mb-4">The Process</SectionTag>
          <SectionTitle className="text-4xl md:text-5xl">
            How we work{" "}
            <em className="not-italic italic text-[var(--green)]">together</em>
          </SectionTitle>
        </motion.div>

        {/* ── Steps row ── */}
        <motion.div
          className="flex flex-col md:flex-row md:items-start"
          variants={stepsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              {/* Step */}
              <motion.div
                variants={stepVariant}
                className="flex-1 flex flex-col items-center text-center px-4 md:px-6"
              >
                {/* Circle */}
                <div className="w-20 h-20 rounded-full bg-[#2A4D38] flex items-center justify-center mb-6 shrink-0">
                  <span className="font-[var(--font-cormorant)] text-xl font-bold text-[var(--cream)] tracking-wide">
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--text-dark)] mb-3 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-[var(--font-dm-sans)] text-sm text-[var(--text-light)] leading-relaxed max-w-[260px]">
                  {step.desc}
                </p>
              </motion.div>

              {/* Dashed connector — desktop only, between steps */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:flex items-center self-start shrink-0 mt-10 mx-1"
                  aria-hidden="true"
                >
                  <div className="w-10 lg:w-16 border-t-2 border-dashed border-[var(--cream-dark)]" />
                </div>
              )}

              {/* Vertical spacer — mobile only, between steps */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden flex flex-col items-center py-4" aria-hidden="true">
                  <div className="h-8 border-l-2 border-dashed border-[var(--cream-dark)]" />
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="mt-16 flex justify-center"
          variants={ctaVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Button href="/contact" variant="primary" size="lg">
            Start with a Free Call
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
