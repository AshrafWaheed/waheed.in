'use client';

/**
 * The case study reader.
 *
 * A dialog rather than a route because the study is an aside to the homepage,
 * not a destination: the visitor is mid-scroll evaluating whether we can do the
 * work, and sending them to /work/optipart costs them their place on the page
 * and their scroll position on the way back. When there are eight of these and
 * they need their own URLs to share, this content already lives in
 * content/case-studies.ts and can be rendered by a route with no rewrite.
 *
 * Scroll animation inside a scrolling dialog is the fiddly part. The site's
 * global ScrollReveal queries the document once on mount, so it cannot see
 * anything this component adds later; and useScrollProgress measures against
 * the viewport, which is the wrong frame once content scrolls inside a panel.
 * So this carries its own IntersectionObserver rooted on the panel.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useLenis } from '@/components/motion/SmoothScroll';
import StackButton from '@/components/ui/StackButton';
import type { CaseStudy } from '@/content/case-studies';

/**
 * Reveal-on-enter for blocks inside the scrolling panel.
 *
 * `ready` is load-bearing, not decoration. This component renders null until it
 * has mounted (the portal needs a document), so on the first pass `panel.current`
 * is null — and a ref object is stable, so an effect keyed only on the ref would
 * never run again once the real DOM appeared. Every block would sit at opacity 0
 * forever, which is exactly what happened the first time.
 *
 * A scroll sweep rather than an IntersectionObserver, which was the second
 * thing that went wrong. IO only reports THRESHOLD CROSSINGS, so a reader who
 * drags the scrollbar or presses End jumps blocks straight from below the panel
 * to above it without ever intersecting, and they stay invisible: measured at
 * 6 of 25 revealed after one jump to the bottom. Comparing positions instead
 * treats "already scrolled past" and "just came into view" as the same state,
 * which is what a reveal actually means. Revealed elements drop out of the
 * list, so the sweep shrinks to nothing as the reader goes down.
 */
function usePanelReveal(panel: React.RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    const root = panel.current;
    if (!ready || !root) return;

    const pending = Array.from(root.querySelectorAll<HTMLElement>('[data-csm-reveal]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending.forEach((el) => el.classList.add('is-in'));
      return;
    }

    let queued = false;

    const sweep = () => {
      queued = false;
      const box = root.getBoundingClientRect();
      // A little above the panel's bottom edge, so a block is settling as it
      // arrives rather than animating under the reader's eyes.
      const line = box.bottom - box.height * 0.06;

      for (let i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top < line) {
          pending[i].classList.add('is-in');
          pending.splice(i, 1);
        }
      }
      if (pending.length === 0) root.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sweep);
    };

    root.addEventListener('scroll', onScroll, { passive: true });
    sweep(); // whatever is already on screen when the dialog opens

    return () => root.removeEventListener('scroll', onScroll);
  }, [panel, ready]);
}

/** Counts a stat up once its band scrolls in. Static under reduced motion. */
function Stat({ value, label, run }: { value: string; label: string; run: boolean }) {
  const reduce = useReducedMotion();
  const target = Number.parseInt(value, 10);
  const numeric = Number.isFinite(target);
  const [n, setN] = useState(numeric ? 0 : 0);

  useEffect(() => {
    if (!run || !numeric) return;
    if (reduce || target === 0) { setN(target); return; }

    let raf = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, numeric, reduce, target]);

  return (
    <div className="csm-stat">
      <span className="csm-stat-n">{numeric ? n : value}</span>
      <span className="csm-stat-l">{label}</span>
    </div>
  );
}

export default function CaseStudyModal({
  study,
  onClose,
}: {
  study: CaseStudy;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [countRun, setCountRun] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);
  usePanelReveal(panelRef, mounted);

  // Fire the counters when the stats band arrives.
  useEffect(() => {
    const root = panelRef.current;
    const el = statsRef.current;
    // Same first-render-is-null trap as usePanelReveal above.
    if (!mounted || !root || !el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setCountRun(true); io.disconnect(); } },
      { root, threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  /*
   * Freeze the page behind. Lenis has to be stopped explicitly — it drives the
   * page from a rAF loop and does not care about body overflow — and the body
   * is locked as well so a native wheel event over the scrim cannot scroll it.
   * The padding compensates for the scrollbar that overflow:hidden removes,
   * which otherwise shifts the whole site sideways as the dialog opens.
   */
  useEffect(() => {
    const l = lenis?.current;
    l?.stop();

    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      l?.start();
    };
  }, [lenis]);

  // Escape closes; Tab stays inside.
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === headingRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!mounted) return;
    headingRef.current?.focus();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="csm-scrim"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="csm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="csm-title"
        ref={panelRef}
      >
        <header className="csm-bar">
          <span className="csm-bar-client">{study.client}</span>
          <button type="button" className="csm-close" onClick={onClose} aria-label="Close case study">
            <X size={18} />
          </button>
        </header>

        <div className="csm-inner">
          <div className="csm-hero" data-csm-reveal>
            <span className="csm-eyebrow">Case study</span>
            <h2 className="csm-title" id="csm-title" tabIndex={-1} ref={headingRef}>
              {study.client}
            </h2>
            <p className="csm-tagline">{study.tagline}</p>
            <ul className="csm-services">
              {study.services.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className="csm-stats" ref={statsRef} data-csm-reveal>
            {study.stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} run={countRun} />
            ))}
          </div>

          {study.sections.map((section) => (
            <section className="csm-sec" key={section.heading}>
              <h3 className="csm-sec-h" data-csm-reveal>{section.heading}</h3>

              {section.body?.map((p) => (
                <p className="csm-p" key={p.slice(0, 40)} data-csm-reveal>{p}</p>
              ))}

              {section.bullets && (
                <ul className="csm-list" data-csm-reveal>
                  {section.bullets.map((b) => <li key={b.slice(0, 40)}>{b}</li>)}
                </ul>
              )}

              {section.blocks?.map((block) => (
                <div className="csm-block" key={block.heading ?? block.body?.[0]} data-csm-reveal>
                  {block.heading && <h4 className="csm-block-h">{block.heading}</h4>}
                  {block.body?.map((p) => <p className="csm-p" key={p.slice(0, 40)}>{p}</p>)}
                  {block.bullets && (
                    <ul className="csm-list">
                      {block.bullets.map((b) => <li key={b.slice(0, 40)}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}

              {section.figures?.map((f) => (
                <figure className="csm-fig" key={f.src} data-csm-reveal>
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={1200}
                    height={1553}
                    className="csm-fig-img"
                    sizes="(max-width: 900px) 92vw, 820px"
                  />
                  <figcaption>{f.caption}</figcaption>
                </figure>
              ))}
            </section>
          ))}

          <div className="csm-close-note" data-csm-reveal>
            <p className="csm-closing">{study.closing}</p>
            <StackButton href="/contact" size="lg">
              Start a project <ArrowRight size={16} />
            </StackButton>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
