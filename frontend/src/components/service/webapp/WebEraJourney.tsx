'use client';

/**
 * WebEraJourney — the opening of 01 · Web Development, rebuilt as a time machine.
 *
 * One browser window is pinned centre-stage. As you scroll the tall track behind
 * it, the window MORPHS through four eras of web design — 1996 Netscape/table
 * layout → 2004 Web 2.0 gloss → 2012 flat & responsive → today's Waheed standard
 * — always showing the SAME brand, so the point lands on sight: look how far the
 * craft (and we) have come. A HUD counts the year up and names each era.
 *
 * Mechanics, and why they are what they are:
 *  · Pin = `position: sticky`. This site's Lenis moves the REAL window scroll
 *    (no transformed wrapper), so sticky survives — see SmoothScroll's header.
 *  · Progress = a rAF-while-visible read of the track's rect (the useScrollProgress
 *    technique), because Framer's useScroll never advances under Lenis. We drive
 *    the crossfade IMPERATIVELY (layer opacities, chrome data-era, HUD text) so a
 *    60fps scrub costs no React renders — the same discipline as useParallaxOrigin.
 *  · A stepped map gives each era a DWELL before the crossfade, so it reads as
 *    four destinations, not one continuous smear.
 *  · Reduced motion OR narrow viewport → the pin is abandoned and the four eras
 *    stack as static, captioned cards. The scrub effect simply never runs.
 *
 * The screens are `aria-hidden` pastiche; the readable meaning is the intro
 * heading, the per-era caption, and the outro. Narration copy is web-eras.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import Khatam from '@/components/graphics/Khatam';
import { webJourney, webEras } from '@/content/services/web-eras';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: d } }),
};

const N = webEras.length; // 4

/**
 * Stepped progress→position with equal DWELL plateaus and short crossfades, so
 * every era — the 1996 opener AND the "today" finale — gets held clean, not just
 * flashed at a segment boundary. The track is N holds + (N-1) transitions of
 * equal width; even bands hold an era, odd bands smoothstep to the next.
 */
function positionFor(p: number): number {
  const units = N + (N - 1);        // 4 holds + 3 transitions = 7
  const u = Math.min(units, Math.max(0, p * units));
  const b = Math.min(units - 1, Math.floor(u));
  const f = u - b;
  if (b % 2 === 0) return b / 2;     // hold on era b/2
  const from = (b - 1) / 2;          // transition from → from+1
  return from + f * f * (3 - 2 * f); // smoothstep
}

export default function WebEraJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const urlRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // 'pin' = scrubbed sticky morph; 'static' = stacked cards (reduced-motion / mobile).
  const [mode, setMode] = useState<'pin' | 'static'>('pin');

  useEffect(() => {
    const reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowQ = window.matchMedia('(max-width: 760px)');
    const sync = () => setMode(reduceQ.matches || narrowQ.matches ? 'static' : 'pin');
    sync();
    reduceQ.addEventListener('change', sync);
    narrowQ.addEventListener('change', sync);
    return () => {
      reduceQ.removeEventListener('change', sync);
      narrowQ.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'pin') return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let raf = 0;
    let running = false;
    let era = -1; // last era whose HUD/chrome we wrote

    const paint = () => {
      const r = track.getBoundingClientRect();
      const ih = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - ih)));
      const pos = positionFor(p);

      // Crossfade the four screens; the nearer an era is to `pos`, the more opaque.
      const layers = layerRefs.current;
      for (let i = 0; i < N; i++) {
        const el = layers[i];
        if (!el) continue;
        const o = Math.min(1, Math.max(0, 1 - Math.abs(pos - i)));
        el.style.opacity = String(o);
        el.style.transform = `scale(${(0.984 + 0.016 * o).toFixed(4)})`;
        el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      }
      stage.style.setProperty('--we-fill', `${((pos / (N - 1)) * 100).toFixed(2)}%`);

      // Snap the chrome + HUD to the nearest era, only when it changes.
      const active = Math.round(pos);
      if (active !== era) {
        era = active;
        const e = webEras[active];
        if (frameRef.current) frameRef.current.dataset.era = String(active);
        if (yearRef.current) yearRef.current.textContent = e.year;
        if (tagRef.current) tagRef.current.textContent = e.tag;
        if (capRef.current) capRef.current.textContent = e.caption;
        if (titleRef.current) titleRef.current.textContent = e.os;
        if (urlRef.current) urlRef.current.textContent = e.url;
        const dots = dotsRef.current?.children;
        if (dots) for (let i = 0; i < dots.length; i++)
          dots[i].classList.toggle('is-active', i === active);
      }
    };

    const loop = () => { paint(); if (running) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); paint(); }
      },
      { rootMargin: '200px 0px 200px 0px' },
    );
    io.observe(track);
    paint();
    return () => { io.disconnect(); cancelAnimationFrame(raf); running = false; };
  }, [mode]);

  const setLayer = (i: number) => (el: HTMLDivElement | null) => { layerRefs.current[i] = el; };

  return (
    <section className="we-journey" data-section-color="dark" data-mode={mode}>
      {/* ── Intro / hero head ─────────────────────────────────────────────── */}
      <div className="cnt we-intro">
        <motion.p className="ab-pill" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {webJourney.eyebrow}
        </motion.p>
        <h1 className="we-h1">
          <SplitReveal text={webJourney.h1.lead} by="word" trigger="mount" delay={0.24} stagger={0.04} />{' '}
          <em><SplitReveal text={webJourney.h1.em} by="word" trigger="mount" delay={0.5} stagger={0.04} /></em>
        </h1>
        <motion.p className="we-sub" custom={0.7} variants={fadeUp} initial="hidden" animate="visible">
          {webJourney.sub}
        </motion.p>
        <motion.div className="we-acts" custom={0.85} variants={fadeUp} initial="hidden" animate="visible">
          <ExplodeButton href="/contact" className="btn btn-gold">Book a free clarity call →</ExplodeButton>
          <span className="we-cue" aria-hidden="true">{webJourney.cue}</span>
        </motion.div>
      </div>

      {/* ── The pinned time machine ───────────────────────────────────────── */}
      <div className="we-track" ref={trackRef}>
        <div className="we-stage" ref={stageRef}>
          <div className="we-browser" ref={frameRef} data-era="0">
            {/* Chrome — one markup, morphed by [data-era] in CSS. */}
            <div className="we-titlebar">
              <span className="we-winbtns" aria-hidden="true"><i /><i /><i /></span>
              <span className="we-title" ref={titleRef}>{webEras[0].os}</span>
              <span className="we-winbtns we-winbtns--r" aria-hidden="true"><i /><i /><i /></span>
            </div>
            <div className="we-menubar" aria-hidden="true">
              <span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Bookmarks</span><span>Help</span>
            </div>
            <div className="we-toolbar">
              <span className="we-navbtns" aria-hidden="true"><i>‹</i><i>›</i><i>⟳</i></span>
              <span className="we-url"><span className="we-lock" aria-hidden="true" /><span ref={urlRef}>{webEras[0].url}</span></span>
              <span className="we-go" aria-hidden="true">Go</span>
            </div>

            {/* Screens — four stacked, crossfaded. Pastiche, so aria-hidden. */}
            <div className="we-screen" aria-hidden="true">
              {/* 1996 */}
              <div className="we-era we-era--90s" ref={setLayer(0)}>
                <span className="we-era-cap"><b>{webEras[0].year}</b> {webEras[0].tag}</span>
                <div className="e9">
                  <div className="e9-marquee"><span>★ WELCOME TO WAHEED&apos;S HOME PAGE ★ UNDER CONSTRUCTION ★ BEST VIEWED IN NETSCAPE NAVIGATOR @ 800×600 ★ SIGN MY GUESTBOOK ★&nbsp;&nbsp;&nbsp;</span></div>
                  <h2 className="e9-title">Waheed&apos;s Web Page</h2>
                  <p className="e9-blink">·· Web Pages For The Whole Ummah! ··</p>
                  <hr className="e9-hr" />
                  <div className="e9-body">
                    <div className="e9-nav">
                      <b>Navigation</b>
                      <a href="#e9">Home</a>
                      <a href="#e9">Guestbook</a>
                      <a href="#e9">Web Rings</a>
                      <a href="#e9">Email Me!</a>
                    </div>
                    <div className="e9-main">
                      <p>Welcome, cyber-surfer! You have reached the <b>#1 web design</b> spot on the information superhighway.</p>
                      <table className="e9-table"><tbody>
                        <tr><td>✔ HTML Pages</td><td>✔ Animated GIFs</td></tr>
                        <tr><td>✔ Guestbooks</td><td>✔ Hit Counters</td></tr>
                      </tbody></table>
                      <div className="e9-construction"><span /></div>
                    </div>
                  </div>
                  <hr className="e9-hr" />
                  <p className="e9-counter">You are visitor&nbsp;<span className="e9-digits">000173</span></p>
                  <p className="e9-foot">© 1996 Waheed · Made with Notepad · Netscape Now!</p>
                </div>
              </div>

              {/* 2004 */}
              <div className="we-era we-era--00s" ref={setLayer(1)}>
                <span className="we-era-cap"><b>{webEras[1].year}</b> {webEras[1].tag}</span>
                <div className="e0">
                  <div className="e0-top">
                    <span className="e0-logo">waheed<span className="e0-beta">beta</span></span>
                    <span className="e0-search"><span className="e0-search-in">search the web 2.0…</span><span className="e0-search-btn">Search</span></span>
                  </div>
                  <div className="e0-hero">
                    <div className="e0-hero-tx">
                      <h2>Welcome to the <em>new</em> web.</h2>
                      <p>Now with RSS feeds, AJAX, and rounded corners on <b>everything</b>.</p>
                      <div className="e0-btns">
                        <span className="e0-btn e0-btn--green">Sign up — it&apos;s free!</span>
                        <span className="e0-btn e0-btn--glass">Take a tour</span>
                      </div>
                    </div>
                    <div className="e0-badge"><b>web</b><span>2.0</span></div>
                  </div>
                  <div className="e0-cloud">
                    <span className="s5">blog</span><span className="s2">podcast</span><span className="s4">RSS</span>
                    <span className="s1">AJAX</span><span className="s3">tags</span><span className="s2">mashup</span>
                    <span className="s4">social</span><span className="s1">folksonomy</span><span className="s3">widgets</span>
                    <span className="s2">beta</span><span className="s1">wiki</span><span className="s3">feeds</span>
                  </div>
                </div>
              </div>

              {/* 2012 */}
              <div className="we-era we-era--10s" ref={setLayer(2)}>
                <span className="we-era-cap"><b>{webEras[2].year}</b> {webEras[2].tag}</span>
                <div className="e1">
                  <header className="e1-nav">
                    <span className="e1-brand">WAHEED</span>
                    <nav className="e1-links"><span>Work</span><span>About</span><span>Services</span><span>Contact</span></nav>
                    <span className="e1-burger" aria-hidden="true"><i /><i /><i /></span>
                  </header>
                  <section className="e1-hero">
                    <h2>We build websites<br />that work everywhere.</h2>
                    <p>Flat. Fast. Responsive. Retina-ready.</p>
                    <span className="e1-cta">Get Started</span>
                  </section>
                  <div className="e1-cols">
                    {[
                      { d: 'M6 20 L18 8 L30 20', t: 'Responsive' },
                      { d: 'M8 18 h20 M8 12 h20 M8 24 h12', t: 'Retina' },
                      { d: 'M18 6 v14 M12 14 l6 6 l6 -6', t: 'Fast' },
                    ].map((c) => (
                      <div key={c.t} className="e1-col">
                        <span className="e1-ico"><svg viewBox="0 0 36 30"><path d={c.d} /></svg></span>
                        <p className="e1-col-t">{c.t}</p>
                        <p className="e1-col-b">Lorem ipsum dolor sit amet consectetur.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Today */}
              <div className="we-era we-era--now" ref={setLayer(3)}>
                <span className="we-era-cap"><b>{webEras[3].year}</b> {webEras[3].tag}</span>
                <div className="en">
                  <span className="en-glow" aria-hidden="true" />
                  <span className="en-eyebrow">The Long-Term Partner for Your Halal Brand</span>
                  <h2 className="en-h">Take your brand from <em>invisible</em> to <b>trusted.</b></h2>
                  <p className="en-sub">Fast, accessible, conversion-mapped — on a design system you own outright.</p>
                  <div className="en-acts">
                    <span className="en-btn en-btn--gold">Book a call →</span>
                    <span className="en-btn en-btn--ghost">See the work</span>
                  </div>
                  <div className="en-badges"><span>◎ 100 Lighthouse</span><span>✓ WCAG AA</span><span>❖ Yours to own</span></div>
                  <span className="en-mark" aria-hidden="true"><Khatam size={112} inner={0.5} stroke="rgba(240,217,122,.5)" strokeWidth={1} /></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── HUD ─────────────────────────────────────────────────────────── */}
          <div className="we-hud">
            <div className="we-yeartag">
              <span className="we-year" ref={yearRef}>{webEras[0].year}</span>
              <span className="we-tag" ref={tagRef}>{webEras[0].tag}</span>
            </div>
            <p className="we-caption" ref={capRef}>{webEras[0].caption}</p>
            <div className="we-timeline" ref={dotsRef} aria-hidden="true">
              {webEras.map((e, i) => (
                <span key={e.key} className={`we-dot${i === 0 ? ' is-active' : ''}`}><i />{e.year}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Outro — the hand-off into the argument ────────────────────────── */}
      <div className="cnt we-outro">
        <h2 className="we-outro-h">{webJourney.outro.lead}</h2>
        <p className="we-outro-b">{webJourney.outro.body}</p>
      </div>
    </section>
  );
}
