'use client';

/**
 * GapWorkStack — the interactive card stack on the right of /about's "Gap"
 * section. It replaces the static diagonal collage, which hid two of the three
 * cards behind the front one.
 *
 * The three cards continuously shuffle through three fixed slots (front → mid →
 * back), so every card takes its turn fully visible. It auto-advances while in
 * view, pauses on hover, and can be driven by clicking any card, the arrow, or
 * the dots — so mouse, touch and keyboard all have a way through. Reduced motion
 * stops the autoplay; the manual controls still work.
 *
 * Two cards hold real work mockups (a high-converting site, a social dashboard);
 * the third is a small branded cover, ready to swap for a third screenshot.
 * Geometry (65.5%×73.7% cards on a 519:575 stage, the three slot offsets) is
 * lifted from the original static stack so the resting look is unchanged.
 */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Khatam from '@/components/graphics/Khatam';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The three resting slots, front-most first. Offsets are the original collage. */
const SLOTS = [
  { top: '26.3%', left: '0%',     scale: 1,     z: 3, opacity: 1 },
  { top: '13.6%', left: '17.9%',  scale: 0.965, z: 2, opacity: 1 },
  { top: '0%',    left: '34.5%',  scale: 0.93,  z: 1, opacity: 0.94 },
] as const;

interface Card {
  label: string;
  accent: 'gold' | 'blue' | 'teal';
  img?: { src: string; alt: string };
}

const CARDS: Card[] = [
  {
    label: 'High-converting website',
    accent: 'gold',
    img: { src: '/about/gap-highconverting.jpeg', alt: 'A high-converting website built for a values-led Muslim women’s brand, shown on a laptop.' },
  },
  {
    label: 'High-performing content',
    accent: 'blue',
    img: { src: '/about/gap-social.jpeg', alt: 'A social media performance dashboard on a phone, showing reach, engagement and follower growth all up.' },
  },
  { label: 'Selected work', accent: 'teal' },
];

export default function GapWorkStack() {
  const [r, setR] = useState(0);      // rotation: card i sits in slot (i + r) % 3
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Only autoplay while the stack is on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView || hover) return;
    const id = setInterval(() => setR((v) => v + 1), 4200);
    return () => clearInterval(id);
  }, [reduce, inView, hover]);

  const advance = () => setR((v) => v + 1);
  const front = (3 - (r % 3)) % 3; // which card index is in the front slot
  const goTo = (k: number) =>
    setR((cur) => {
      const target = (3 - k) % 3;
      if (cur % 3 === target) return cur;
      let nr = cur - (cur % 3) + target;
      if (nr < cur) nr += 3;
      return nr;
    });

  return (
    <div
      className="tg-showcase"
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="tg-stack" role="group" aria-label="Examples of the work we build">
        {CARDS.map((card, i) => {
          const slot = SLOTS[(i + r) % 3];
          return (
            <motion.button
              type="button"
              key={card.label}
              className={`tg-card2 tg-card2--${card.accent}`}
              onClick={advance}
              aria-label={`${card.label} — show next`}
              tabIndex={-1}
              initial={false}
              animate={{ top: slot.top, left: slot.left, scale: slot.scale, opacity: slot.opacity }}
              style={{ zIndex: slot.z }}
              transition={{ duration: 0.62, ease: EASE }}
            >
              {card.img ? (
                <Image
                  className="tg-photo"
                  src={card.img.src}
                  alt={card.img.alt}
                  width={340}
                  height={424}
                  sizes="(max-width: 820px) 70vw, 340px"
                />
              ) : (
                <span className="tg-brand">
                  <Khatam size={58} inner={0.5} stroke="rgba(240,217,122,.8)" strokeWidth={1.1} />
                  <span className="tg-brand-k">Selected work</span>
                  <span className="tg-brand-t">The kind of brand we build.</span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="tg-controls">
        <span className="tg-cap" aria-live="polite">{CARDS[front].label}</span>
        <span className="tg-dots" role="tablist" aria-label="Choose an example">
          {CARDS.map((card, i) => (
            <button
              key={card.label}
              type="button"
              className={`tg-dot${i === front ? ' is-active' : ''}`}
              aria-label={`Show ${card.label}`}
              aria-current={i === front}
              onClick={() => goTo(i)}
            />
          ))}
        </span>
        <button type="button" className="tg-next" aria-label="Next example" onClick={advance}>
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
