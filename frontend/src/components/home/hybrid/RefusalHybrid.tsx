'use client';

/**
 * RefusalHybrid — "What We Will Not Build", reskinned to the Figma redesign.
 *
 * Left: heading + a one-line sub with "honour" underlined gold. Right: the six
 * refusals as a 2×3 grid of solid gold tiles (dark text on gold).
 *
 * Motion: a one-shot "deal out" that PLAYS when the tiles scroll into view. They
 * start collapsed into a rotated stack at the grid's centre, then fan out to
 * their natural slots on a per-tile stagger. Each tile's travel is its own offset
 * to the grid centre (read from offsetLeft/offsetTop, which layout — not
 * transform — owns), so it lands exactly in place. CSS transitions do the
 * animation; an IntersectionObserver flips it once. Reduced-motion: no collapse.
 */
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { refusal } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduce = useReducedMotion();
  const tilesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = tilesRef.current;
    if (!ul) return;
    const tiles = Array.from(ul.children) as HTMLElement[];

    if (reduce) {
      tiles.forEach((t) => { t.style.transform = 'none'; t.style.opacity = '1'; });
      return;
    }

    // Collapse into a rotated stack at the grid centre (no transition yet).
    const collapse = () => {
      const cx = ul.clientWidth / 2;
      const cy = ul.clientHeight / 2;
      const mid = (tiles.length - 1) / 2;
      tiles.forEach((t, i) => {
        const dx = cx - (t.offsetLeft + t.offsetWidth / 2);
        const dy = cy - (t.offsetTop + t.offsetHeight / 2);
        const rot = (i - mid) * 3.4;
        t.style.transition = 'none';
        t.style.transform = `translate(${dx}px, ${dy}px) scale(.82) rotate(${rot}deg)`;
        t.style.opacity = i === tiles.length - 1 ? '0.6' : '0.14';
        t.style.zIndex = String(i);
      });
    };

    let dealt = false;
    const deal = () => {
      dealt = true;
      tiles.forEach((t, i) => {
        t.style.transition = `transform .8s cubic-bezier(.22,1,.36,1) ${i * 0.07}s, opacity .5s ${i * 0.07}s`;
        t.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
        t.style.opacity = '1';
      });
    };

    collapse();
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { deal(); io.disconnect(); } },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.25 },
    );
    io.observe(ul);

    const onResize = () => { if (!dealt) collapse(); };
    window.addEventListener('resize', onResize);
    return () => { io.disconnect(); window.removeEventListener('resize', onResize); };
  }, [reduce, items.length]);

  return (
    <section className="rf" data-section-color="dark">
      <div className="cnt rf-grid">
        <motion.div
          className="rf-left"
          initial={reduce ? false : { opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="rf-h">{title}</h2>
          <p className="rf-sub">
            <Sub text={sub} underline={subUnderline} />
          </p>
        </motion.div>

        <ul className="rf-tiles" ref={tilesRef}>
          {items.map((item) => (
            <li key={item} className="rf-tile">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
