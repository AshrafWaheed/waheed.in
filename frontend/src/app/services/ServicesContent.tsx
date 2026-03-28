"use client";

import { motion, type Variants } from "framer-motion";
import { Smartphone, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import Nav           from "@/components/layout/Nav";
import SectionTag    from "@/components/ui/SectionTag";
import SectionTitle  from "@/components/ui/SectionTitle";
import Button        from "@/components/ui/Button";
import ArabicText    from "@/components/ui/ArabicText";
import IslamicGeometry from "@/components/ui/IslamicGeometry";

// ─── Animation constants ─────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const headerAnim: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

const slideRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

// ─── Pricing data ─────────────────────────────────────────────
interface PricingTier {
  tier:      string;
  price:     string;
  period?:   string;
  idealFor?: string;
  features:  string[];
  popular?:  boolean;
}

interface ServiceGroup {
  label: string;
  tiers: PricingTier[];
}

const WEB_DESIGN: ServiceGroup = {
  label: "Web Design & Development",
  tiers: [
    {
      tier:     "Starter",
      price:    "$599",
      period:   "one-time",
      idealFor: "New businesses needing a clean, fast website",
      features: [
        "Up to 5 pages",
        "Mobile responsive",
        "Contact form",
        "Basic SEO setup",
        "2 rounds of revisions",
        "Delivery in 2 weeks",
      ],
    },
    {
      tier:     "Growth",
      price:    "$899",
      period:   "one-time",
      idealFor: "Growing brands needing more content and polish",
      popular:  true,
      features: [
        "Up to 10 pages",
        "Mobile responsive",
        "Blog setup",
        "Contact + lead capture forms",
        "On-page SEO",
        "Google Analytics setup",
        "3 rounds of revisions",
        "Delivery in 3 weeks",
      ],
    },
    {
      tier:     "Authority",
      price:    "$1,899",
      period:   "one-time",
      idealFor: "Established brands needing a full digital presence",
      features: [
        "Unlimited pages",
        "Custom animations",
        "CMS integration",
        "Advanced SEO",
        "Performance optimisation",
        "Priority support",
        "Unlimited revisions",
        "Delivery in 5 weeks",
      ],
    },
  ],
};

const SOCIAL_MEDIA: ServiceGroup = {
  label: "Social Media Marketing",
  tiers: [
    {
      tier:     "Starter",
      price:    "$349",
      period:   "/month",
      idealFor: "Brands just starting their social presence",
      features: [
        "2 platforms",
        "12 posts/month",
        "Basic graphic design",
        "Monthly report",
        "Halal content only",
      ],
    },
    {
      tier:     "Growth",
      price:    "$549",
      period:   "/month",
      idealFor: "Active brands wanting consistent growth",
      popular:  true,
      features: [
        "3 platforms",
        "20 posts/month",
        "Custom graphics + reels",
        "Community management",
        "Bi-weekly report",
        "Halal content only",
        "No paid campaigns for haram products",
      ],
    },
    {
      tier:     "Authority",
      price:    "$1,249",
      period:   "/month",
      idealFor: "Brands wanting full social media management",
      features: [
        "All platforms",
        "Unlimited posts",
        "Full creative direction",
        "Paid campaign management",
        "Weekly strategy calls",
        "Detailed analytics",
        "Halal content only",
      ],
    },
  ],
};

const MAINTENANCE: ServiceGroup = {
  label: "Website Maintenance",
  tiers: [
    {
      tier:    "Starter",
      price:   "$49",
      period:  "/month",
      features: [
        "Monthly updates",
        "Security monitoring",
        "Uptime monitoring",
        "Monthly backup",
      ],
    },
    {
      tier:    "Growth",
      price:   "$99",
      period:  "/month",
      popular: true,
      features: [
        "Weekly updates",
        "Security monitoring + fixes",
        "Performance checks",
        "Weekly backups",
        "Priority email support",
        "Monthly report",
      ],
    },
    {
      tier:    "Authority",
      price:   "$179",
      period:  "/month",
      features: [
        "Daily monitoring",
        "Unlimited small edits",
        "Performance optimisation",
        "Daily backups",
        "Dedicated support",
        "Monthly report",
      ],
    },
  ],
};

const COACHING: ServiceGroup = {
  label: "Halal Business Coaching",
  tiers: [
    {
      tier:     "Group Session",
      price:    "₹1,000",
      idealFor: "Muslim entrepreneurs wanting community learning",
      features: [
        "90-minute group session",
        "Up to 10 participants",
        "Topic-based learning",
        "Q&A included",
        "Session recording",
      ],
    },
    {
      tier:     "Private Coaching",
      price:    "₹10,000",
      idealFor: "Founders needing 1-on-1 focused guidance",
      features: [
        "2-hour private session",
        "Business diagnosis",
        "Custom action plan",
        "2-week follow-up support",
        "Recorded session",
      ],
    },
  ],
};

const PRICING_GROUPS: ServiceGroup[] = [WEB_DESIGN, SOCIAL_MEDIA, MAINTENANCE, COACHING];

// ─── PricingCard ──────────────────────────────────────────────
function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div
      variants={fadeUp}
      className={[
        "relative flex flex-col bg-white rounded-xl p-8 h-full",
        tier.popular
          ? "border-2 border-[var(--yellow)] md:scale-[1.02] z-10 shadow-lg"
          : "border border-[var(--cream-dark)] shadow-sm",
      ].join(" ")}
    >
      {/* Popular badge */}
      {tier.popular && (
        <span className="absolute top-4 right-4 bg-[var(--yellow)] text-[var(--text-dark)] font-[var(--font-dm-sans)] font-bold uppercase tracking-widest rounded-sm px-2.5 py-1 leading-none"
          style={{ fontSize: "0.6rem" }}>
          Most Popular
        </span>
      )}

      {/* Tier name */}
      <p className="font-[var(--font-dm-sans)] text-xs font-semibold uppercase tracking-widest text-[var(--text-light)] mb-4">
        {tier.tier}
      </p>

      {/* Price */}
      <div className="mb-1">
        <span
          className="font-[var(--font-cormorant)] font-bold text-[var(--text-dark)] leading-none"
          style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}
        >
          {tier.price}
        </span>
      </div>
      {tier.period && (
        <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] mb-4">
          {tier.period}
        </p>
      )}

      {/* Ideal for */}
      {tier.idealFor && (
        <p className="font-[var(--font-dm-sans)] text-sm italic text-[var(--text-mid)] mb-6 leading-relaxed">
          {tier.idealFor}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-[var(--cream-dark)] mb-6" />

      {/* Features */}
      <ul className="space-y-2.5 flex-1 mb-8">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span
              className="text-[var(--yellow)] shrink-0 mt-[1px]"
              style={{ fontSize: "0.6rem" }}
              aria-hidden="true"
            >
              ✦
            </span>
            <span className="font-[var(--font-dm-sans)] text-sm text-[var(--text-dark)] leading-snug">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button href="/contact" variant="primary" size="md" className="w-full justify-center">
        Get Started
      </Button>
    </motion.div>
  );
}

// ─── PricingGroup ─────────────────────────────────────────────
function PricingGroup({ group, index }: { group: ServiceGroup; index: number }) {
  const isCoaching = group.tiers.length === 2;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={index > 0 ? "pt-16 border-t border-[var(--cream-dark)]" : ""}
    >
      {/* Group label */}
      <motion.h3
        variants={headerAnim}
        className="font-[var(--font-cormorant)] text-2xl md:text-3xl font-semibold text-[var(--text-dark)] mb-8"
      >
        {group.label}
      </motion.h3>

      {/* Cards */}
      <motion.div
        variants={stagger}
        className={[
          "grid gap-6",
          isCoaching
            ? "grid-cols-1 sm:grid-cols-2 max-w-3xl"
            : "grid-cols-1 md:grid-cols-3",
        ].join(" ")}
      >
        {group.tiers.map((tier) => (
          <PricingCard key={tier.tier} tier={tier} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function ServicesContent() {
  return (
    <main className="bg-[var(--cream)]">
      <Nav />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — Page Hero
      ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#2A4D38] pt-40 pb-24 px-6 overflow-hidden">
        {/* Islamic geometry */}
        <div
          className="absolute top-0 right-0 z-0 pointer-events-none select-none translate-x-1/4 -translate-y-1/4"
          aria-hidden="true"
        >
          <IslamicGeometry size={600} color="#F5F0E8" opacity={0.06} />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Bismillah */}
          <motion.div variants={fadeUp} className="mb-6">
            <ArabicText size="xl" opacity={0.5} className="text-[var(--cream)]">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </ArabicText>
          </motion.div>

          {/* Tag */}
          <motion.div variants={fadeUp} className="mb-5">
            <SectionTag light>What We Offer</SectionTag>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            className="font-[var(--font-cormorant)] font-bold italic text-[var(--cream)] leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            Ethical digital services for Muslim-led brands.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="font-[var(--font-dm-sans)] text-[var(--cream)]/65 text-base md:text-lg leading-relaxed max-w-2xl"
          >
            Every service we offer is built on the same foundation — transparency,
            intention, and accountability before Allah.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — Tiered Pricing
      ══════════════════════════════════════════════════════ */}
      <section id="pricing" className="bg-[var(--cream)] py-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <motion.div
            className="mb-16"
            variants={headerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SectionTag className="mb-4">Fixed Pricing</SectionTag>
            <SectionTitle className="text-4xl md:text-5xl">
              Clear prices.{" "}
              <em className="not-italic italic text-[var(--green)]">No surprises.</em>
            </SectionTitle>
          </motion.div>

          {/* Pricing groups */}
          <div className="space-y-16">
            {PRICING_GROUPS.map((group, i) => (
              <PricingGroup key={group.label} group={group} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Project-Based Services
      ══════════════════════════════════════════════════════ */}
      <section id="custom" className="bg-[#2A4D38] py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            className="mb-14"
            variants={headerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SectionTag accent className="mb-4">Custom Projects</SectionTag>
            <SectionTitle light className="text-4xl md:text-5xl mb-6">
              Mobile apps &amp; custom software —{" "}
              <em className="not-italic italic text-[var(--yellow)]">scoped to your needs.</em>
            </SectionTitle>
            <p className="font-[var(--font-dm-sans)] text-[var(--text-light)] text-base leading-relaxed max-w-2xl">
              These services vary too much in scope for fixed pricing. We start with a
              free consultation to understand your requirements, then provide a clear
              proposal with timeline and cost — no obligations.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile App */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col bg-[#3D6B4F] rounded-xl p-8"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-[var(--yellow)] flex items-center justify-center mb-5 shrink-0">
                <Smartphone size={22} className="text-[var(--text-dark)]" strokeWidth={1.8} />
              </div>

              <h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--cream)] mb-1">
                Mobile App Development
              </h3>
              <p className="font-[var(--font-dm-sans)] text-xs text-[var(--yellow)] tracking-wide mb-4">
                React Native · Flutter · iOS + Android
              </p>
              <p className="font-[var(--font-dm-sans)] text-sm text-[var(--text-light)] leading-relaxed mb-6 flex-1">
                Native-quality mobile apps for iOS and Android. Built on our shared
                Laravel backend — same auth, same API, same ethical foundation.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  "React Native or Flutter",
                  "iOS + Android",
                  "Laravel API backend",
                  "Push notifications (FCM)",
                  "App Store deployment",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-[var(--yellow)] shrink-0 mt-[1px]" style={{ fontSize: "0.6rem" }} aria-hidden="true">✦</span>
                    <span className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/80">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--yellow)] hover:text-[var(--yellow-soft)] transition-colors duration-200"
              >
                Book a Free Consultation
                <ArrowRight size={13} strokeWidth={2} />
              </a>
            </motion.div>

            {/* Custom Software */}
            <motion.div
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col bg-[#3D6B4F] rounded-xl p-8"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-[var(--yellow)] flex items-center justify-center mb-5 shrink-0">
                <Layers size={22} className="text-[var(--text-dark)]" strokeWidth={1.8} />
              </div>

              <h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--cream)] mb-1">
                Custom Software Development
              </h3>
              <p className="font-[var(--font-dm-sans)] text-xs text-[var(--yellow)] tracking-wide mb-4">
                Laravel · Next.js · SaaS · Automation
              </p>
              <p className="font-[var(--font-dm-sans)] text-sm text-[var(--text-light)] leading-relaxed mb-6 flex-1">
                Web SaaS platforms, business automation tools, internal dashboards,
                and API integrations — built clean and built to last.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  "Web SaaS & dashboards",
                  "Business automation",
                  "API integrations",
                  "Internal tools",
                  "Ongoing support available",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-[var(--yellow)] shrink-0 mt-[1px]" style={{ fontSize: "0.6rem" }} aria-hidden="true">✦</span>
                    <span className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/80">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--yellow)] hover:text-[var(--yellow-soft)] transition-colors duration-200"
              >
                Book a Free Consultation
                <ArrowRight size={13} strokeWidth={2} />
              </a>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — ISLAMify Course Teaser
      ══════════════════════════════════════════════════════ */}
      <section id="islamify" className="bg-[var(--yellow)] py-24 px-6 overflow-hidden">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#1A2E22]/40" aria-hidden="true" />
            <span className="font-[var(--font-dm-sans)] text-xs font-semibold uppercase tracking-widest text-[#1A2E22]">
              Coming Soon
            </span>
            <span className="block w-8 h-px bg-[#1A2E22]/40" aria-hidden="true" />
          </div>

          {/* Title */}
          <h2
            className="font-[var(--font-cormorant)] font-bold text-[#1A2E22] leading-tight mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            ISLAMify Your Business
          </h2>

          {/* Description */}
          <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-base leading-relaxed mb-8 max-w-xl mx-auto">
            A complete course on building and growing a Shariah-conscious business in
            the digital age. Curriculum in development.
          </p>

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-sm px-8 py-4 font-[var(--font-dm-sans)] font-semibold text-lg bg-[#2A4D38] text-[var(--cream)] hover:bg-[#3D6B4F] transition-colors duration-200"
          >
            Join the Waitlist
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — Bottom CTA
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[var(--cream)] py-24 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2
            className="font-[var(--font-cormorant)] font-semibold text-[var(--text-dark)] leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Not sure which service fits?
          </h2>
          <p className="font-[var(--font-dm-sans)] text-[var(--text-mid)] text-base leading-relaxed mb-8">
            Book a free 30-minute consultation. We will understand your goals and
            recommend the right path — honestly.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Book a Free Consultation
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
