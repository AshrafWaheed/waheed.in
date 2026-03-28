"use client";

import { motion, type Variants } from "framer-motion";
import { Globe, Megaphone, Compass, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Service {
  num:   string;
  icon:  LucideIcon;
  title: string;
  desc:  string;
  href:  string;
}

const SERVICES: Service[] = [
  {
    num:   "01",
    icon:  Globe,
    title: "Web Design & Development",
    desc:  "From concept to launch — fast, clean, Shariah-conscious websites built to convert.",
    href:  "/services/web-design",
  },
  {
    num:   "02",
    icon:  Megaphone,
    title: "Social Media Marketing",
    desc:  "Ethical content strategies that grow your audience without manipulation or haram tactics.",
    href:  "/services/social-media",
  },
  {
    num:   "03",
    icon:  Compass,
    title: "Halal Business Coaching",
    desc:  "Clarity on direction, pricing, and positioning — all within Islamic business principles.",
    href:  "/services/coaching",
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

        {/* ── Service cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.num}
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
                  {service.num}
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
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-[var(--font-dm-sans)] text-sm leading-relaxed text-[var(--text-mid)] group-hover:text-[var(--cream)]/70 transition-colors duration-300 flex-1 mb-7">
                  {service.desc}
                </p>

                {/* Ghost CTA */}
                <a
                  href={service.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--green)] group-hover:text-[var(--yellow)] transition-colors duration-300"
                  tabIndex={0}
                >
                  Learn More
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
