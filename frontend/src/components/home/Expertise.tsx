'use client';

import { useEffect, useRef } from 'react';

const DOORS = [
  {
    num: '01',
    title: 'Web & App Development',
    desc: 'Your website is the first impression and the closing pitch. We build sites and applications that load fast, convert decisively, and keep selling while your team sleeps.',
    promise: 'Built to convert. Made to last.',
    cta: 'Build my platform →',
    soon: false,
  },
  {
    num: '02',
    title: 'Custom Software Development',
    desc: "Off-the-shelf tools weren't built for your business. We engineer dashboards, integrations, and automations that pay themselves back in saved hours and clearer decisions.",
    promise: 'Software that earns its keep.',
    cta: 'Streamline operations →',
    soon: false,
  },
  {
    num: '03',
    title: 'Brand Strategy',
    desc: 'A weak brand competes on price; a strong brand commands premium trust. We craft positioning, narrative and visual systems that make the right buyer feel chosen — and the wrong buyer move on.',
    promise: 'Positioning that pre-sells.',
    cta: 'Sharpen the brand →',
    soon: false,
  },
  {
    num: '04',
    title: 'SEO',
    desc: 'Ads stop the moment you stop paying. We compound your visibility on Google with technical fixes, intent-driven content, and authority signals that bring qualified buyers to your door — for years.',
    promise: 'Traffic that compounds.',
    cta: 'Grow organic reach →',
    soon: false,
  },
  {
    num: '05',
    title: 'Social Media Marketing',
    desc: 'Posting daily and praying for reach is not a strategy. We build content engines that earn trust first, sell second, and turn passive followers into a community that buys, refers and returns.',
    promise: 'Followers, then customers.',
    cta: 'Build the audience →',
    soon: false,
  },
  {
    num: '06',
    title: 'Conversion Copywriting',
    desc: 'Beautiful design without sharp words leaves money on the table. We write headlines, landing pages and email sequences that move readers from curious to convinced — and convinced to customer.',
    promise: 'Words that close.',
    cta: 'Convert with words →',
    soon: true,
  },
];

export default function Expertise() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef      = useRef<HTMLDivElement>(null);
  const prevRef     = useRef<HTMLButtonElement>(null);
  const nextRef     = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sc   = scrollerRef.current;
    const row  = rowRef.current;
    const prev = prevRef.current;
    const next = nextRef.current;
    if (!sc || !row) return;

    function tick() {
      const r      = sc!.getBoundingClientRect();
      const vh     = window.innerHeight;
      const total  = sc!.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      const raw    = total > 0 ? scrolled / total : 0;
      const p      = Math.min(1, Math.max(0, raw / 0.55));
      const eased  = 1 - Math.pow(1 - p, 3);
      sc!.style.setProperty('--p', eased.toFixed(3));

      if (prev && next) {
        const overflow  = row!.scrollWidth > row!.clientWidth + 4;
        const showNav   = eased > 0.85 && overflow;
        prev.classList.toggle('show', showNav);
        next.classList.toggle('show', showNav);
      }
    }

    function scrollBy(dir: number) {
      const card = row!.querySelector('.door') as HTMLElement | null;
      if (!card) return;
      const gap  = parseFloat(getComputedStyle(row!).gap || '0');
      row!.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    }

    let raf: number | null = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; tick(); });
    }

    prev?.addEventListener('click', () => scrollBy(-1));
    next?.addEventListener('click', () => scrollBy(1));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="expertise-doors">
      <div className="doors-scroller" ref={scrollerRef}>
        <div className="doors-stage">

          <div className="cnt doors-head">
            <span className="eyebrow-v2">Our craft</span>
            <h2 className="doors-h">
              Six disciplines, one <em>standard.</em>
            </h2>
          </div>

          <div className="doors-row" ref={rowRef}>
            {DOORS.map((d, i) => (
              <div
                key={d.num}
                className="door"
                data-i={i}
                style={d.soon ? { opacity: 0.72 } : undefined}
              >
                <div className="door-inner">
                  <span className="door-num">{d.num}</span>

                  {d.soon && (
                    <span className="door-soon-badge">Coming Soon</span>
                  )}

                  <h3 className="door-title">{d.title}</h3>
                  <p className="door-desc">{d.desc}</p>
                  <span className="door-promise">{d.promise}</span>
                  <span className="door-cta">{d.cta}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            ref={prevRef}
            className="doors-nav prev"
            type="button"
            aria-label="Previous discipline"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            className="doors-nav next"
            type="button"
            aria-label="Next discipline"
          >
            ›
          </button>

        </div>
      </div>
    </section>
  );
}
