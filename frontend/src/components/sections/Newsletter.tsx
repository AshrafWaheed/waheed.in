"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import SectionTag from "@/components/ui/SectionTag";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
  { value: "2,400+", label: "Muslim entrepreneurs subscribed" },
  { value: "Weekly",  label: "Halal business insights" },
  { value: "Zero",   label: "Dark patterns. Ever." },
];

const leftVariant: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const rightVariant: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.15 } },
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="bg-[var(--yellow)] py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── Left ── */}
        <motion.div
          variants={leftVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag className="mb-5 border-[#1A2E22]/30 text-[#1A2E22]">
            Newsletter
          </SectionTag>

          <h2
            className="font-[var(--font-cormorant)] font-bold text-[#1A2E22] leading-tight mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Grow your business
            <br />
            <em className="not-italic italic">without compromising your deen.</em>
          </h2>

          <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-base leading-relaxed mb-10 max-w-md">
            Weekly insights on halal business strategy, ethical digital marketing, and faith-aligned growth — straight to your inbox.
          </p>

          {/* Stats */}
          <ul className="space-y-4">
            {STATS.map((stat) => (
              <li key={stat.label} className="flex items-baseline gap-3">
                <span
                  className="text-[var(--yellow)] shrink-0"
                  style={{ fontSize: "0.7rem" }}
                  aria-hidden="true"
                >
                  ✦
                </span>
                <span className="font-[var(--font-dm-sans)] font-semibold text-[#1A2E22] text-sm">
                  {stat.value}
                </span>
                <span className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-sm">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Right ── */}
        <motion.div
          variants={rightVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {submitted ? (
            <div className="bg-[var(--cream)] rounded-2xl p-10 text-center shadow-sm">
              <p
                className="font-[var(--font-cormorant)] italic font-semibold text-[#1A2E22] mb-3"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
              >
                JazakAllahu Khayran.
              </p>
              <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-sm">
                You&apos;re on the list. The first issue lands in your inbox this week.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--cream)] rounded-2xl p-8 md:p-10 shadow-sm">
              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="newsletter-email"
                  className="block font-[var(--font-dm-sans)] font-semibold text-sm text-[var(--text-dark)] mb-2"
                >
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-[var(--cream-dark)] bg-white px-4 py-3 font-[var(--font-dm-sans)] text-sm text-[var(--text-dark)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[#2A4D38] mb-4 transition"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#2A4D38] px-6 py-3 font-[var(--font-dm-sans)] font-semibold text-sm text-[var(--cream)] hover:bg-[#3D6B4F] transition-colors duration-200"
                >
                  Subscribe — it&apos;s free
                </button>
              </form>

              <p className="mt-5 font-[var(--font-dm-sans)] text-[10px] text-[var(--text-light)] leading-relaxed text-center">
                No spam. No affiliate promotions. Unsubscribe any time with one click. Your data is never sold.
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
