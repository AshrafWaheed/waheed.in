"use client";

import { motion } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ManifestoBand() {
  return (
    <section className="bg-[#E8C547] py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 md:px-16 relative flex items-center justify-center">

        {/* ── Decorative ✦ left ── */}
        <motion.span
          aria-hidden="true"
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 font-[var(--font-cormorant)] leading-none select-none text-[#1A2E22] pointer-events-none"
          style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          ✦
        </motion.span>

        {/* ── Decorative ✦ right ── */}
        <motion.span
          aria-hidden="true"
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 font-[var(--font-cormorant)] leading-none select-none text-[#1A2E22] pointer-events-none"
          style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          ✦
        </motion.span>

        {/* ── Quote ── */}
        <motion.div
          className="relative z-10 text-center max-w-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <blockquote
            className="font-[var(--font-cormorant)] italic font-semibold text-[#1A2E22] leading-[1.15]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            &ldquo;If growth costs integrity, it is not growth.&rdquo;
          </blockquote>

          <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-sm mt-5 tracking-wide">
            — WAHEED Manifesto
          </p>
        </motion.div>

      </div>
    </section>
  );
}
