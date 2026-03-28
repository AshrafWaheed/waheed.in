"use client";

import { motion, type Variants } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const INDICATORS = [
  "Shariah-Compliant",
  "Transparent Pricing",
  "Muslim-Led Studio",
  "Long-Term Growth",
  "Ihsan in Every Detail",
] as const;

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export default function TrustStrip() {
  return (
    <section className="bg-[#EDE7D9] border-t border-b border-[var(--cream-dark)] py-5 px-6">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-y-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {INDICATORS.map((label, i) => (
          <motion.div
            key={label}
            variants={item}
            className={[
              "flex items-center justify-center gap-2.5 py-1",
              // On mobile: 5th item spans both columns and centers itself
              i === 4 ? "col-span-2 md:col-span-1" : "",
            ].join(" ")}
          >
            {/* Islamic star bullet */}
            <span
              className="text-[var(--yellow)] leading-none select-none"
              style={{ fontSize: "1rem" }}
              aria-hidden="true"
            >
              ✦
            </span>

            <span
              className="font-[var(--font-dm-sans)] text-[var(--text-dark)] font-medium"
              style={{ fontSize: "0.85rem" }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
