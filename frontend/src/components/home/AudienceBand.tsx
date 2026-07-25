'use client';

import { useEffect, useRef, useState } from 'react';

const ITEMS = [
  {
    num: '01',
    title: 'Halal D2C Brands',
    body: 'Halal D2C brands in food, modest fashion, lifestyle, and beauty that have built something truly impactful for the Ummah and want to grow it the right way.',
  },
  {
    num: '02',
    title: 'Islamic Educational Institutions',
    body: 'Academies, ed-tech platforms, and Islamic learning institutions building engaging learning environments that respect both their pedagogy and their audiences.',
  },
  {
    num: '03',
    title: 'NGOs, Charities & Masajid',
    body: "Da'wah organisations, fundraising operations, and masajid that need digital systems built to compound, not just sizzle when a seasonal campaign ends.",
  },
  {
    num: '04',
    title: 'Muslim Coaches & Educators',
    body: 'Coaches, consultants, and educators building personal brands grounded in Islamic wisdom, who need a digital presence that reflects their credibility and converts the right students and clients.',
  },
];

export default function AudienceBand() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [autoDone, setAutoDone]   = useState(false);
  const rootRef   = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cycle on entry
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function cycle(i: number) {
      if (i >= ITEMS.length) {
        setActiveIdx(null);
        setAutoDone(true);
        return;
      }
      setActiveIdx(i);
      timerRef.current = setTimeout(() => cycle(i + 1), 2000);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            obs.unobserve(root);
            cycle(0);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(root);

    return () => {
      obs.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleClick(i: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutoDone(true);
    setActiveIdx((prev) => (prev === i ? null : i));
  }

  function handleMouseEnter(i: number) {
    if (!autoDone) return;
    setActiveIdx(i);
  }

  function handleMouseLeave() {
    if (!autoDone) return;
    setActiveIdx(null);
  }

  return (
    <section className="audience">
      <div className="cnt">
        <div className="audience-head">
          <div>
            <span className="eyebrow-v2">Who we work with</span>
            <h2 className="reveal">
              We transform brands that{' '}
              <em style={{ color: 'var(--heading)' }}>refuse to compromise their values.</em>
            </h2>
          </div>
        </div>

        <div
          className="aud-accordion"
          ref={rootRef}
          onMouseLeave={handleMouseLeave}
        >
          {ITEMS.map((item, i) => {
            const isOpen = activeIdx === i;
            return (
              <div
                key={item.num}
                className={`aud-acc-item${isOpen ? ' open' : ''}`}
                onMouseEnter={() => handleMouseEnter(i)}
              >
                <button
                  className="aud-acc-head"
                  type="button"
                  onClick={() => handleClick(i)}
                  aria-expanded={isOpen}
                >
                  <span className="aud-acc-num">{item.num}</span>
                  <span className="aud-acc-title">{item.title}</span>
                  <span className="aud-acc-chev" aria-hidden="true" />
                </button>
                <div className="aud-acc-body">
                  <p>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
