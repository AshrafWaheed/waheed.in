'use client';

/**
 * AppJourneyRails — the ambient "build journey" that flanks the App Development
 * phone in its wide side gutters.
 *
 * The App page renders as one tall phone (AppPhone) centred on a dark stage,
 * leaving the left/right gutters empty on desktop. This fills them WITHOUT
 * touching a pixel of the phone: it mounts as a sibling of `.md-frame`, spans
 * the whole stage, and is `pointer-events: none`, so the phone stays fully
 * interactive and unchanged.
 *
 * What it draws: two vertical gold "spines" whose fill advances with how far you
 * have scrolled through the phone (the journey), six milestone nodes that light
 * up as the fill passes them (Idea → Design → Build → Test → Launch → Grow),
 * frosted cards that slide in beside each node, drifting motes, and two faint
 * rotating khatam ornaments for depth. Desktop-only (there is no gutter to fill
 * below ~1180px), reduced-motion safe (the spine snaps full, drift/rotate stop).
 */
import { useEffect, useRef, type RefObject } from 'react';
import {
  motion, useMotionValue, useTransform, useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Compass, Palette, Code2, ShieldCheck, Rocket, TrendingUp } from 'lucide-react';
import Khatam from '@/components/graphics/Khatam';

const EASE = [0.22, 1, 0.36, 1] as const;

type Side = 'l' | 'r';
interface Waypoint {
  side: Side;
  top: number;   // vertical placement down the stage, %
  at: number;    // journey fraction (0–1) at which the node lights
  num: string;
  Icon: typeof Compass;
  title: string;
  sub: string;
}

/* The six stations of the build. Copy is generic to this journey — it does not
   repeat any string from inside the phone, so the two never fight. */
const WAYPOINTS: readonly Waypoint[] = [
  { side: 'l', top: 10, at: 0.06, num: '01', Icon: Compass,     title: 'Idea',   sub: 'One clear problem' },
  { side: 'r', top: 26, at: 0.22, num: '02', Icon: Palette,     title: 'Design', sub: 'Flows before pixels' },
  { side: 'l', top: 42, at: 0.39, num: '03', Icon: Code2,       title: 'Build',  sub: 'One codebase' },
  { side: 'r', top: 58, at: 0.55, num: '04', Icon: ShieldCheck, title: 'Test',   sub: 'Hardened, not rushed' },
  { side: 'l', top: 74, at: 0.71, num: '05', Icon: Rocket,      title: 'Launch', sub: 'iOS & Android' },
  { side: 'r', top: 90, at: 0.86, num: '06', Icon: TrendingUp,  title: 'Grow',   sub: 'They reopen it' },
] as const;

/**
 * How far the stage has travelled through the viewport, 0→1 — 0 when the stage
 * top aligns with the viewport top, 1 when its bottom aligns with the bottom.
 * Same rAF-while-visible technique as useScrollProgress (Lenis-safe), but
 * measured across the element's FULL length rather than a band, because the
 * phone is many viewports tall and we want the spine to fill the whole way down.
 */
function useTraverse(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const p = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { p.set(1); return; }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const ih = window.innerHeight || 1;
      const total = Math.max(1, r.height - ih);
      p.set(Math.min(1, Math.max(0, -r.top / total)));
    };
    const loop = () => { measure(); if (running) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); measure(); }
      },
      { rootMargin: '0px' },
    );
    io.observe(el);
    measure();
    return () => { io.disconnect(); cancelAnimationFrame(raf); running = false; };
  }, [ref, p, reduce]);

  return p;
}

/** One milestone: a node on the spine that lights as the journey passes it, and
 *  a frosted card that slides in from the gutter beside it. */
function Station({ wp, p, reduce }: { wp: Waypoint; p: MotionValue<number>; reduce: boolean | null }) {
  const { Icon } = wp;
  // The node's gold "lit" ring cross-fades in over a short band ending at `at`.
  const lit = useTransform(p, [wp.at - 0.05, wp.at + 0.01], [0, 1], { clamp: true });
  const fromX = wp.side === 'l' ? -18 : 18;

  return (
    <div className={`mj-wp mj-wp--${wp.side}`} style={{ top: `${wp.top}%` }}>
      <span className="mj-node">
        <Icon size={17} strokeWidth={2} />
        <motion.span className="mj-node-ring" style={{ opacity: lit }} aria-hidden="true" />
      </span>
      <motion.div
        className="mj-card"
        style={{ y: '-50%' }}
        initial={reduce ? false : { opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="mj-card-k">{wp.num}</span>
        <p className="mj-card-t">{wp.title}</p>
        <p className="mj-card-b">{wp.sub}</p>
      </motion.div>
    </div>
  );
}

export default function AppJourneyRails() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = useTraverse(ref);
  const fillH = useTransform(p, [0, 1], ['0%', '100%']);

  return (
    <div className="mj" ref={ref} aria-hidden="true">
      {/* Far-gutter brand ornaments — depth only. */}
      <span className="mj-orn mj-orn--top">
        <Khatam size={340} inner={0.52} stroke="rgba(240,217,122,.5)" strokeWidth={1} />
      </span>
      <span className="mj-orn mj-orn--bot">
        <Khatam size={420} inner={0.46} stroke="rgba(120,180,190,.5)" strokeWidth={1} />
      </span>

      {/* The two spines and their scroll-driven fill. */}
      {(['l', 'r'] as const).map((s) => (
        <div key={s} className={`mj-rail mj-rail--${s}`}>
          <motion.span className="mj-rail-fill" style={{ height: fillH }} />
          {!reduce && [0, 1, 2].map((i) => (
            <span key={i} className="mj-mote" style={{ animationDelay: `${i * 2.3}s` }} />
          ))}
        </div>
      ))}

      {WAYPOINTS.map((wp) => (
        <Station key={wp.num} wp={wp} p={p} reduce={reduce} />
      ))}
    </div>
  );
}
