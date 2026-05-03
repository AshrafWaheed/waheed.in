'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const WORDS = ['If', 'growth', 'costs', 'integrity,', 'it', 'is', 'not', 'growth.'];

function ManifestoWord({ word, index }: { word: string; index: number }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      {
        threshold: 0.8,
        rootMargin: '-20% 0px -20% 0px',
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.span
      ref={ref}
      className="inline-block mx-2 my-1 font-[var(--font-cormorant)] italic font-light leading-none"
      style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
      animate={{
        opacity: active ? 1 : 0.15,
        color: active ? '#1a2e22' : 'rgba(26,46,34,0.15)',
      }}
      transition={{ duration: 0.4 }}
      key={index}
    >
      {word}
    </motion.span>
  );
}

export default function HomeManifesto() {
  return (
    <section className="bg-[#E8C547] py-32 md:py-48 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
        <blockquote>
          <div className="flex flex-wrap justify-center">
            {WORDS.map((word, i) => (
              <ManifestoWord key={i} word={word} index={i} />
            ))}
          </div>
        </blockquote>

        <motion.p
          className="font-[var(--font-dm-sans)] text-sm text-[rgba(26,46,34,0.5)] mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          — WAHEED Manifesto
        </motion.p>
      </div>
    </section>
  );
}
