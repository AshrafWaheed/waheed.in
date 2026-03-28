"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ServiceGroup {
  num:      string;
  icon:     LucideIcon;
  title:    string;
  desc:     string;
  services: string[];
  href:     string;
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    num:   "01",
    icon:  Code2,
    title: "Web, Mobile & Custom Software",
    desc:  "From marketing websites to mobile apps and full SaaS platforms — built clean, fast, and Shariah-conscious.",
    services: [
      "Web Design & Development",
      "Mobile App (React Native / Flutter)",
      "Custom Software & SaaS",
    ],
    href: "/services",
  },
  {
    num:   "02",
    icon:  TrendingUp,
    title: "Social Media Marketing",
    desc:  "Ethical content strategies that grow your audience without manipulation, pressure, or haram tactics.",
    services: [
      "Content Strategy",
      "Community Management",
      "Paid Campaigns (halal products only)",
    ],
    href: "/services",
  },
  {
    num:   "03",
    icon:  BookOpen,
    title: "Halal Business Coaching",
    desc:  "Clarity on direction, pricing, and positioning — all grounded in Islamic business principles.",
    services: [
      "Group Sessions (₹1,000)",
      "Private Coaching (₹10,000)",
      "ISLAMify Your Business Course",
    ],
    href: "/services",
  },
];

// Header fade-up
const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

// Cards stagger container
const cardsContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

export default function FeaturedServices() {
  return (
    <section id="services" className="bg-[var(--cream)] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          className="mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag className="mb-4">What We Offer</SectionTag>
          <SectionTitle
            className="text-4xl md:text-5xl max-w-xl"
            emphasis="Muslim-led brands."
          >
            Ethical digital services for
          </SectionTitle>
        </motion.div>

        {/* ── Service group cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SERVICE_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <motion.article
                key={group.num}
                variants={cardVariant}
                className={[
                  "group relative flex flex-col p-8 rounded-sm",
                  "border border-[var(--cream-dark)]",
                  "bg-[var(--cream)] hover:bg-[#2A4D38]",
                  "transition-all duration-300 ease-out",
                  "cursor-default",
                ].join(" ")}
              >
                {/* Number */}
                <span
                  className="font-[var(--font-cormorant)] font-bold leading-none mb-5 text-[var(--yellow)] opacity-50 group-hover:opacity-70 transition-opacity duration-300 select-none"
                  style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
                  aria-hidden="true"
                >
                  {group.num}
                </span>

                {/* Icon */}
                <div className="mb-5">
                  <Icon
                    size={28}
                    strokeWidth={1.6}
                    className="text-[var(--green)] group-hover:text-[var(--yellow)] transition-colors duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--text-dark)] group-hover:text-[var(--cream)] transition-colors duration-300 mb-3 leading-tight">
                  {group.title}
                </h3>

                {/* Description */}
                <p className="font-[var(--font-dm-sans)] text-sm leading-relaxed text-[var(--text-mid)] group-hover:text-[var(--cream)]/70 transition-colors duration-300 mb-5">
                  {group.desc}
                </p>

                {/* Sub-services list */}
                <ul className="flex flex-col gap-1.5 mb-7 flex-1">
                  {group.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-2 font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] group-hover:text-[var(--cream)]/55 transition-colors duration-300"
                    >
                      <span
                        className="text-[var(--yellow)] shrink-0 leading-none"
                        style={{ fontSize: "0.6rem" }}
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>

                {/* Ghost CTA */}
                <a
                  href={group.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--green)] group-hover:text-[var(--yellow)] transition-colors duration-300"
                  tabIndex={0}
                >
                  View Pricing
                  <ArrowRight
                    size={14}
                    strokeWidth={2}
                    className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </a>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
