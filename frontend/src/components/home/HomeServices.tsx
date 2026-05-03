'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import SectionTitle from '@/components/ui/SectionTitle';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Service {
  num: string;
  title: string;
  tagline: string;
  desc: string;
  items: string[];
  link: string;
}

const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Web, Mobile & Custom Software',
    tagline: 'Purpose-built digital products.',
    desc: 'Not templates, not shortcuts. We build with Laravel and Next.js for web, React Native and Flutter for mobile — intentional software that serves real needs.',
    items: ['Web Design & Development', 'Mobile Apps (React Native / Flutter)', 'Custom Software & SaaS Platforms'],
    link: '/services',
  },
  {
    num: '02',
    title: 'Social Media Marketing',
    tagline: 'Real growth, built on trust.',
    desc: 'No manufactured virality, no haram tactics, no dark patterns. Ethical content strategy and community management that actually serves your audience.',
    items: ['Content Strategy & Creation', 'Community Management', 'Ethical Campaigns'],
    link: '/services',
  },
  {
    num: '03',
    title: 'Halal Business Coaching',
    tagline: 'Embed faith into every decision.',
    desc: 'Our signature ISLAMify coaching programme helps Muslim entrepreneurs align their business model, pricing, and brand with Islamic values.',
    items: ['Group Sessions — ₹1,000/session', 'Private Coaching — ₹10,000/session', 'ISLAMify Your Business Course'],
    link: '/services',
  },
];

function ServicePanel({ service }: { service: Service }) {
  return (
    <motion.div
      key={service.num}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="h-full flex flex-col justify-center"
    >
      <p className="font-[var(--font-cormorant)] text-[var(--yellow)] leading-none mb-4"
         style={{ fontSize: '5rem' }}>
        {service.num}
      </p>
      <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] font-light leading-tight mb-3"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        {service.title}
      </h3>
      <p className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.7)] text-base">
        {service.tagline}
      </p>
    </motion.div>
  );
}

function ServiceBlock({
  service,
  index,
  onVisible,
}: {
  service: Service;
  index: number;
  onVisible: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(index);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onVisible]);

  return (
    <div
      ref={ref}
      className="py-16 border-b border-[rgba(245,240,232,0.1)] last:border-0"
    >
      <p className="font-[var(--font-cormorant)] text-[rgba(245,240,232,0.2)] leading-none mb-4"
         style={{ fontSize: '7rem' }}>
        {service.num}
      </p>
      <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] font-light leading-tight mb-4"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
        {service.title}
      </h3>
      <p className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.65)] text-base leading-relaxed mb-6">
        {service.desc}
      </p>
      <ul className="space-y-2 mb-6">
        {service.items.map((item) => (
          <li key={item} className="flex items-start gap-2 font-[var(--font-dm-sans)] text-[var(--cream)] text-sm">
            <span className="text-[var(--yellow)] text-xs mt-0.5 shrink-0">✦</span>
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={service.link}
        className="font-[var(--font-dm-sans)] text-[var(--yellow)] text-sm hover:underline"
      >
        View Pricing →
      </Link>
    </div>
  );
}

export default function HomeServices() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section className="bg-[#2A4D38] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionTag accent>What We Offer</SectionTag>
        <SectionTitle
          light
          className="mt-4 mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}
        >
          Ethical digital services for Muslim-led brands.
        </SectionTitle>

        {/* Desktop: two-column layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-16">
          {/* Left: scrolling service blocks */}
          <div>
            {SERVICES.map((service, i) => (
              <ServiceBlock
                key={service.num}
                service={service}
                index={i}
                onVisible={setActiveService}
              />
            ))}
          </div>

          {/* Right: sticky panel */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="bg-[#3D6B4F] rounded-3xl p-10 min-h-[360px]">
              <AnimatePresence mode="wait">
                <ServicePanel key={activeService} service={SERVICES[activeService]} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile: simple cards */}
        <div className="md:hidden space-y-4">
          {SERVICES.map((service) => (
            <div key={service.num} className="bg-[#3D6B4F] rounded-2xl p-6">
              <p className="font-[var(--font-cormorant)] text-[var(--yellow)] text-4xl leading-none mb-3">
                {service.num}
              </p>
              <h3 className="font-[var(--font-cormorant)] text-[var(--cream)] font-light text-2xl mb-3">
                {service.title}
              </h3>
              <p className="font-[var(--font-dm-sans)] text-[rgba(245,240,232,0.65)] text-base leading-relaxed mb-4">
                {service.desc}
              </p>
              <ul className="space-y-2 mb-4">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 font-[var(--font-dm-sans)] text-[var(--cream)] text-sm">
                    <span className="text-[var(--yellow)] text-xs mt-0.5 shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={service.link} className="font-[var(--font-dm-sans)] text-[var(--yellow)] text-sm hover:underline">
                View Pricing →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
