'use client';

import { useEffect, useRef } from 'react';

const DOORS = [
  {
    num: '01',
    title: 'Web & App Development',
    desc: 'Your website is the first impression and the closing pitch. We build sites and applications that load fast, convert decisively, and are built to convert visitors you never speak to.',
    promise: 'Built to convert. Made to last.',
    soon: false,
  },
  {
    num: '02',
    title: 'Custom Software Development',
    desc: "Off-the-shelf tools weren't built for your business. We engineer dashboards, integrations, and automations that pay themselves back in saved hours and clearer decisions.",
    promise: 'Software that earns its keep.',
    soon: false,
  },
  {
    num: '03',
    title: 'Brand Strategy',
    desc: 'A weak brand competes on price; a strong brand commands premium trust. We craft positioning, narrative and visual systems that make the right buyer feel chosen, and the wrong buyer move on.',
    promise: 'Positioning that pre-sells.',
    soon: false,
  },
  {
    num: '04',
    title: 'SEO',
    desc: 'Ads stop the moment you stop paying. We compound your visibility on Google with technical fixes, intent-driven content, and authority signals that bring qualified buyers to your door, for years.',
    promise: 'Traffic that compounds.',
    soon: false,
  },
  {
    num: '05',
    title: 'Social Media Marketing',
    desc: 'Posting daily and praying for reach is not a strategy. We build content engines that earn trust first, sell second, and turn passive followers into a community that buys, refers and returns.',
    promise: 'Content engagements, then sales.',
    soon: false,
  },
  {
    num: '06',
    title: 'Conversion Copywriting',
    desc: 'Beautiful design without sharp words leaves money on the table. We write headlines, landing pages and email sequences that move readers from curious to convinced, and convinced to customer.',
    promise: 'Words that close.',
    soon: true,
  },
  {
    num: '07',
    title: 'Ad Creatives',
    desc: 'Sharp targeting still dies on weak creative. We design and write scroll-stopping ad creatives (static, motion, and copy) engineered to earn attention and turn cold audiences into buyers, without clickbait or compromise.',
    promise: 'Creative that earns the click.',
    soon: true,
  },
];

// How much vertical scroll (in viewport heights) the separation phase takes
// before the horizontal card-scroll begins.
const SEP_VH = 1;

export default function Expertise() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sc  = scrollerRef.current;
    const row = rowRef.current;
    if (!sc || !row) return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    let maxScroll = 0;   // horizontal distance the cards travel
    let sepPx     = 0;   // vertical scroll length of the separation phase

    function tick() {
      if (isMobile()) return;
      const r        = sc!.getBoundingClientRect();
      const vh       = window.innerHeight;
      const total    = sc!.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);

      // Phase 1, cards separate (eased)
      const p1    = sepPx > 0 ? Math.min(1, scrolled / sepPx) : 1;
      const eased = 1 - Math.pow(1 - p1, 3);
      sc!.style.setProperty('--p', eased.toFixed(4));

      // Phase 2, cards scroll horizontally, 1:1 with continued vertical scroll
      const p2 = maxScroll > 0
        ? Math.min(1, Math.max(0, (scrolled - sepPx) / maxScroll))
        : 0;
      row!.scrollLeft = maxScroll * p2;
    }

    function measure() {
      if (isMobile()) {
        // Mobile: no pin, static section with native horizontal swipe
        sc!.style.height = '';
        sc!.style.setProperty('--p', '1');
        row!.scrollLeft = 0;
        return;
      }
      const vh = window.innerHeight;
      sepPx = vh * SEP_VH;

      // Measure the horizontal travel at the fully-separated state
      const prevP = sc!.style.getPropertyValue('--p');
      sc!.style.setProperty('--p', '1');
      maxScroll = Math.max(0, row!.scrollWidth - row!.clientWidth);
      sc!.style.setProperty('--p', prevP || '0');

      // Pin height = one viewport (pin) + separation + horizontal travel
      sc!.style.height = `${vh + sepPx + maxScroll}px`;
      tick();
    }

    let raf: number | null = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; tick(); });
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section className="expertise-doors">
      <div className="doors-scroller" ref={scrollerRef}>
        <div className="doors-stage">

          <div className="cnt doors-head">
            <span className="eyebrow-v2">Our craft</span>
            <h2 className="doors-h">
              Seven crafts, one <em>standard.</em>
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
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
