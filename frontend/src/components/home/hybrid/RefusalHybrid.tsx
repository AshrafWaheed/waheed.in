'use client';

/**
 * RefusalHybrid — "What We Will Not Build", reskinned to the Figma redesign.
 *
 * Left: heading + a one-line sub with "honour" underlined gold. Right: the six
 * refusals as a 2×3 grid of solid gold tiles (dark text on gold).
 *
 * Motion: SCROLL-SCRUBBED "deal out". The tiles start collapsed into a rotated
 * stack at the grid's centre and, as the section scrolls through, fan out to
 * their natural grid slots. Each tile's travel is its own offset to the grid
 * centre (read from offsetLeft/offsetTop, which layout — not transform — owns),
 * so it lands exactly in place. Driven by the shared scroll progress; reverses
 * on scroll-up, and reduced-motion pins it fully distributed.
 */
import { useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { Dice5, Percent, Music, VenetianMask, Wine, EyeOff } from 'lucide-react';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
import { refusal } from '@/content/home';

/** One icon per refusal, in the order of `refusal.items` (content/home.ts):
 *  gambling · interest · haram entertainment · manipulation · intoxicants · adult. */
const ICONS = [Dice5, Percent, Music, VenetianMask, Wine, EyeOff] as const;

/** Underline the one phrase in the sub. */
function Sub({ text, underline }: { text: string; underline: string }) {
  const i = text.indexOf(underline);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="rf-uline">{underline}</span>
      {text.slice(i + underline.length)}
    </>
  );
}

export default function RefusalHybrid() {
  const { title, sub, subUnderline, items } = refusal;
  const headRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLUListElement>(null);

  const pHead = useScrollProgress(headRef);
  const headY = useTransform(pHead, [0, 0.8], [40, 0], { clamp: true });
  const headO = useTransform(pHead, [0, 0.55], [0, 1], { clamp: true });

  const pTiles = useScrollProgress(tilesRef, { startVh: 0.9, endVh: 0.4 });

  useEffect(() => {
    const ul = tilesRef.current;
    if (!ul) return;
    const tiles = Array.from(ul.children) as HTMLElement[];
    let offsets: { dx: number; dy: number; rot: number }[] = [];

    const measure = () => {
      const cx = ul.clientWidth / 2;
      const cy = ul.clientHeight / 2;
      const mid = (tiles.length - 1) / 2;
      offsets = tiles.map((t, i) => ({
        dx: cx - (t.offsetLeft + t.offsetWidth / 2),
        dy: cy - (t.offsetTop + t.offsetHeight / 2),
        rot: (i - mid) * 3.2, // slight fan in the stacked state
      }));
    };

    const apply = (v: number) => {
      const c = 1 - v; // collapse amount: 1 = fully stacked, 0 = placed
      const s = 0.82 + 0.18 * v;
      tiles.forEach((t, i) => {
        const o = offsets[i];
        if (!o) return;
        t.style.transform = `translate(${o.dx * c}px, ${o.dy * c}px) scale(${s}) rotate(${o.rot * c}deg)`;
        // The stack reads as one object: only the top tile is opaque collapsed,
        // the rest fade in as they leave the pile.
        t.style.opacity = String(Math.min(1, (i === tiles.length - 1 ? 0.55 : 0.12) + v));
        t.style.zIndex = String(i);
      });
    };

    measure();
    apply(pTiles.get());
    const unsub = pTiles.on('change', apply);
    const onResize = () => { measure(); apply(pTiles.get()); };
    window.addEventListener('resize', onResize);
    return () => { unsub(); window.removeEventListener('resize', onResize); };
  }, [pTiles, items.length]);

  return (
    <section className="rf" data-section-color="dark">
      <div className="cnt rf-grid">
        <motion.div className="rf-left" ref={headRef} style={{ y: headY, opacity: headO }}>
          <h2 className="rf-h">{title}</h2>
          <p className="rf-sub">
            <Sub text={sub} underline={subUnderline} />
          </p>
        </motion.div>

        <ul className="rf-tiles" ref={tilesRef}>
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Dice5;
            return (
              <li key={item} className="rf-tile">
                <span className="rf-tile-i" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
                <span className="rf-tile-t">{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
