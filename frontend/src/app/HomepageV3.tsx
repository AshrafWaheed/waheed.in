'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import '@/styles/homepage-v3.css';

export default function HomepageV3() {
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // custom cursor
      document.body.classList.add('hp-cursor-hidden');
      const cur = document.getElementById('cursor');
      const ring = document.getElementById('cursor-ring');
      if (cur && ring) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        const onMove = (e: MouseEvent) => {
          mx = e.clientX; my = e.clientY;
          cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        };
        document.addEventListener('mousemove', onMove);
        const loop = () => {
          rx += (mx - rx) * 0.09; ry += (my - ry) * 0.09;
          ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
          requestAnimationFrame(loop);
        };
        loop();
        document.querySelectorAll('a,button,.hp-work-row,.hp-journal-card,.hp-svc-dot').forEach(el => {
          el.addEventListener('mouseenter', () => {
            cur.style.width = '18px'; cur.style.height = '18px';
            cur.style.background = '#e8c547';
          });
          el.addEventListener('mouseleave', () => {
            cur.style.width = '10px'; cur.style.height = '10px';
            cur.style.background = '#2a4d38';
          });
        });
      }

      // nav compact on scroll
      const nav = document.getElementById('hp-nav');
      if (nav) {
        ScrollTrigger.create({
          start: '80 top',
          onEnter: () => nav.classList.add('compact'),
          onLeaveBack: () => nav.classList.remove('compact'),
        });
      }

      // hero entrance
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('#h-eye',   { opacity: 1, y: 0, duration: .9, delay: .2 })
          .to('.hp-hero-line span', { y: '0%', duration: 1.1, stagger: .13 }, '-=.5')
          .to('#h-foot',  { opacity: 1, duration: .9 }, '-=.4')
          .to('#h-scroll', { opacity: 1, duration: .6 }, '-=.3');

        gsap.from('.hp-hero-col', {
          scaleY: 0, transformOrigin: 'top', duration: 1.6,
          stagger: .05, ease: 'power3.out', delay: .1,
        });

        // hero parallax
        gsap.to('.hp-hero-bism', { y: -100, scrollTrigger: { trigger: '.hp-hero', start: 'top top', end: 'bottom top', scrub: 1.8 } });
        gsap.to('.hp-hero-orb',  { y: -50, scale: 1.08, scrollTrigger: { trigger: '.hp-hero', start: 'top top', end: 'bottom top', scrub: 2.2 } });
        gsap.to('#h-foot, #h-eye, #h-title', {
          y: 60, opacity: 0,
          scrollTrigger: { trigger: '.hp-hero', start: '35% top', end: '85% top', scrub: 1 },
        });

        // generic [data-r] reveals
        document.querySelectorAll('[data-r]').forEach((el, i) => {
          gsap.from(el as Element, {
            y: 35, opacity: 0, duration: .95, ease: 'power3.out',
            scrollTrigger: { trigger: el as Element, start: 'top 87%', once: true },
            delay: (i % 4) * 0.07,
          });
        });

        // philosophy
        gsap.from('.hp-phil-big', {
          clipPath: 'inset(0 100% 0 0)', duration: 1.3, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.hp-phil-big', start: 'top 82%', once: true },
        });
        gsap.from('.hp-phil-stat', {
          y: 28, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: '.hp-phil-stats', start: 'top 84%', once: true },
        });

        // count-up
        document.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt((el as HTMLElement).dataset.count || '0');
          const span = el.querySelector('span');
          if (!span) return;
          ScrollTrigger.create({
            trigger: el as Element, start: 'top 82%', once: true,
            onEnter: () => {
              gsap.to({ v: 0 }, {
                v: target, duration: 1.5, ease: 'power2.out',
                onUpdate: function () { span.textContent = String(Math.round((this.targets()[0] as { v: number }).v)); },
              });
            },
          });
        });

        // services horizontal scroll
        const svcWrapper = document.getElementById('hp-svc-wrapper');
        const svcSticky  = document.getElementById('hp-svc-sticky');
        const svcTrack   = document.getElementById('hp-svc-track');
        if (svcWrapper && svcSticky && svcTrack) {
          const panels = svcTrack.querySelectorAll('.hp-svc-panel');
          const dots   = document.querySelectorAll('.hp-svc-dot');
          const W = window.innerWidth;
          const scrollSpace = W * panels.length * 0.95;
          svcWrapper.style.height = scrollSpace + 'px';

          ScrollTrigger.create({
            trigger: svcWrapper,
            start: 'top top',
            end: `+=${scrollSpace}`,
            pin: svcSticky,
            pinSpacing: false,
            scrub: 1.2,
            onUpdate(self) {
              const x = -self.progress * (W * (panels.length - 1));
              gsap.set(svcTrack, { x });
              const idx = Math.min(panels.length - 1, Math.round(Math.abs(x) / W));
              dots.forEach((d, i) => {
                d.classList.toggle('on', i === idx);
                d.classList.toggle('hp-svc-dot-intro', i === 0);
              });
              panels.forEach((p, i) => p.classList.toggle('glow-on', i === idx));
            },
          });

          dots.forEach(dot => {
            dot.addEventListener('click', () => {
              const i = parseInt((dot as HTMLElement).dataset.i || '0');
              const st = ScrollTrigger.getAll().find(t => t.vars.trigger === svcWrapper);
              if (st) {
                const top = st.start + (i / (panels.length - 1)) * (st.end - st.start);
                window.scrollTo({ top, behavior: 'smooth' });
              }
            });
          });
        }

        // manifesto line reveal
        ['#hp-ml1', '#hp-ml2', '#hp-ml3'].forEach((sel, i) => {
          const el = document.querySelector(sel);
          if (!el) return;
          gsap.from(el, {
            x: i % 2 === 0 ? -50 : 50, opacity: 0.08, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          });
          ScrollTrigger.create({
            trigger: el, start: 'top 72%',
            onEnter: () => el.classList.add('lit'),
            onLeaveBack: () => el.classList.remove('lit'),
          });
        });

        // process card shadows
        document.querySelectorAll('.hp-process-card').forEach(card => {
          ScrollTrigger.create({
            trigger: card, start: 'top 110px', end: 'bottom 110px',
            onEnter:     () => gsap.to(card, { boxShadow: '0 12px 50px rgba(26,46,34,.12)', duration: .4 }),
            onLeave:     () => gsap.to(card, { boxShadow: 'none', duration: .4 }),
            onLeaveBack: () => gsap.to(card, { boxShadow: 'none', duration: .4 }),
          });
        });

        // work rows stagger
        document.querySelectorAll('.hp-work-row').forEach((row, i) => {
          gsap.from(row, {
            x: -30, opacity: 0, duration: .8, delay: i * .08, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 87%', once: true },
          });
        });

        // testimonials drag
        const track = document.getElementById('hp-test-track');
        if (track) {
          let isDown = false, startX = 0, sl = 0;
          track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; sl = track.scrollLeft; track.style.cursor = 'grabbing'; });
          track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
          track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
          track.addEventListener('mousemove', e => {
            if (!isDown) return; e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            track.scrollLeft = sl - (x - startX) * 1.15;
          });
        }
        gsap.from('#hp-test-track', {
          x: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#hp-test-track', start: 'top 82%', once: true },
        });

        // journal cards stagger
        gsap.from('.hp-journal-card', {
          y: 40, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out',
          scrollTrigger: { trigger: '.hp-journal-grid', start: 'top 84%', once: true },
        });

        // cta clip reveal
        gsap.from('#hp-cta-title', {
          clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: '#hp-cta-title', start: 'top 80%', once: true },
        });

        // no-band tags
        gsap.from('.hp-no-tag', {
          scale: .9, opacity: 0, duration: .55, stagger: .06, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.hp-no-tags', start: 'top 84%', once: true },
        });

        // smooth scroll for hash links
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href) return;
            const t = document.querySelector(href);
            if (t) {
              e.preventDefault();
              window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
            }
          });
        });
      });
    };

    init();

    return () => {
      document.body.classList.remove('hp-cursor-hidden');
      ctx?.revert();
      // kill all ScrollTriggers created in this context
      ScrollTrigger?.getAll?.()?.forEach?.(t => t.kill());
    };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* ══ NAV ══ */}
      <nav id="hp-nav" className="hp-nav">
        <Link href="/" className="hp-nav-logo">W<span>*</span>HEED</Link>
        <ul className="hp-nav-links">
          <li><a href="#hp-philosophy">Studio</a></li>
          <li><a href="#hp-services-section">Services</a></li>
          <li><a href="#hp-work-section">Work</a></li>
          <li><a href="#hp-journal">Journal</a></li>
          <li><Link href="/contact" className="hp-nav-cta">Book a Call</Link></li>
        </ul>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hp-hero" id="home">
        <div className="hp-hero-cols" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="hp-hero-col" />
          ))}
        </div>
        <div className="hp-hero-orb" aria-hidden="true" />
        <div className="hp-hero-orb2" aria-hidden="true" />
        <div className="hp-hero-bism" aria-hidden="true">بِسْمِ اللَّهِ</div>

        <div className="hp-hero-inner">
          <div className="hp-hero-eyebrow" id="h-eye">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ &nbsp;·&nbsp; India&apos;s First Halal Digital Studio
          </div>
          <h1 className="hp-hero-title" id="h-title">
            <span className="hp-hero-line"><span>Success does</span></span>
            <span className="hp-hero-line"><span>not require</span></span>
            <span className="hp-hero-line"><span><em>disobedience.</em></span></span>
          </h1>
          <div className="hp-hero-foot" id="h-foot">
            <p className="hp-hero-desc">We help Muslim-led brands grow online through Shariah-compliant web development, ethical marketing, and purpose-driven coaching.</p>
            <div className="hp-hero-btns">
              <a href="#hp-cta" className="hp-hero-btn hp-hero-btn-primary">
                <span>Book a free call</span>
                <div className="hp-hero-btn-icon">
                  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>
              </a>
              <a href="#hp-services-section" className="hp-hero-btn hp-hero-btn-ghost">
                <span>Explore services</span>
                <div className="hp-hero-btn-icon">
                  <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="hp-hero-scroll" id="h-scroll">
          <div className="hp-hero-scroll-bar" />
          Scroll
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="hp-marquee-wrap">
        <div className="hp-marquee-track">
          {['Shariah-Aligned','No Dark Patterns','Muslim-Led Studio','Transparent Pricing','Ihsan Standard','Long-Term Growth','Ethical by Design','waheed.in'].flatMap(t => [t, t]).map((t, i) => (
            <span key={i} className="hp-m-item">{t} <span className="hp-m-dot" /></span>
          ))}
        </div>
      </div>

      {/* ══ PHILOSOPHY ══ */}
      <section className="hp-philosophy" id="hp-philosophy">
        <div className="hp-philosophy-inner">
          <div data-r="">
            <div className="hp-section-eyebrow">Studio</div>
            <h2 className="hp-phil-big">
              One intention.<br />One standard.<br /><em>One way —<br />aligned.</em>
            </h2>
          </div>
          <div className="hp-phil-right">
            <p className="hp-phil-body" data-r="">
              We believe modern business can exist without compromising faith. Growth does not require deception. Success does not require disobedience.<br /><br />
              Every project we take on is held to the same standard: if growth costs integrity, it is not growth.
            </p>
            <div className="hp-phil-stats" data-r="">
              <div className="hp-phil-stat">
                <div className="hp-phil-stat-num" data-count="100"><span>0</span>%</div>
                <div className="hp-phil-stat-label">Shariah-screened client projects</div>
              </div>
              <div className="hp-phil-stat">
                <div className="hp-phil-stat-num"><span>Zero</span></div>
                <div className="hp-phil-stat-label">Dark patterns — ever</div>
              </div>
              <div className="hp-phil-stat">
                <div className="hp-phil-stat-num" data-count="3"><span>0</span>+</div>
                <div className="hp-phil-stat-label">Services with transparent pricing</div>
              </div>
              <div className="hp-phil-stat">
                <div className="hp-phil-stat-num"><span>Muslim</span></div>
                <div className="hp-phil-stat-label">Founded, led &amp; values-driven</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES HORIZONTAL SCROLL ══ */}
      <div id="hp-services-section" style={{ position: 'relative' }}>
        <div className="hp-svc-wrapper" id="hp-svc-wrapper">
          <div className="hp-svc-sticky" id="hp-svc-sticky">
            <div className="hp-svc-track" id="hp-svc-track">

              {/* intro panel */}
              <div className="hp-svc-panel hp-svc-panel-intro">
                <div className="hp-svc-num" style={{ color: 'rgba(245,240,232,.04)' }}>—</div>
                <div className="hp-svc-content" style={{ maxWidth: '520px' }}>
                  <div className="hp-svc-tag">What We Build</div>
                  <h2 className="hp-svc-title" style={{ marginBottom: '1.5rem' }}>
                    Services<br /><em style={{ color: '#e8c547' }}>built to last</em>
                  </h2>
                  <p className="hp-svc-desc" style={{ marginBottom: '2.5rem' }}>Three core disciplines — each held to the Ihsan standard. Scroll to explore each one.</p>
                  <div className="hp-svc-pills">
                    <span className="hp-svc-pill">Development →</span>
                    <span className="hp-svc-pill">Marketing →</span>
                    <span className="hp-svc-pill">Coaching →</span>
                  </div>
                </div>
              </div>

              {/* Dev panel */}
              <div className="hp-svc-panel hp-svc-panel-light">
                <div className="hp-svc-num">01</div>
                <div className="hp-svc-glow" style={{ background: 'radial-gradient(circle at 80% 50%,rgba(42,77,56,.08),transparent 60%)' }} />
                <div className="hp-svc-content">
                  <div className="hp-svc-icon">
                    <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                  </div>
                  <div className="hp-svc-tag">Development</div>
                  <h3 className="hp-svc-title">Web, Mobile<br />&amp; Custom Software</h3>
                  <p className="hp-svc-desc">Purpose-built digital products — not templates, not shortcuts. Laravel + Next.js for web. React Native and Flutter for mobile.</p>
                  <div className="hp-svc-pills">
                    <span className="hp-svc-pill">Web Design &amp; Dev</span>
                    <span className="hp-svc-pill">React Native</span>
                    <span className="hp-svc-pill">Flutter</span>
                    <span className="hp-svc-pill">Laravel API</span>
                    <span className="hp-svc-pill">SaaS Dashboards</span>
                  </div>
                  <div className="hp-svc-prices">
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Starter</div><div className="hp-svc-price-val">$599</div></div>
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Growth</div><div className="hp-svc-price-val">$899</div></div>
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Authority</div><div className="hp-svc-price-val">$1,899</div></div>
                  </div>
                </div>
              </div>

              {/* Marketing panel */}
              <div className="hp-svc-panel hp-svc-panel-light2">
                <div className="hp-svc-num">02</div>
                <div className="hp-svc-glow" style={{ background: 'radial-gradient(circle at 80% 50%,rgba(232,197,71,.07),transparent 60%)' }} />
                <div className="hp-svc-content">
                  <div className="hp-svc-icon">
                    <svg viewBox="0 0 24 24"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                  </div>
                  <div className="hp-svc-tag">Marketing</div>
                  <h3 className="hp-svc-title">Ethical Social<br />Media Marketing</h3>
                  <p className="hp-svc-desc">Real community growth without deception, dark patterns, or haram tactics. Because manufactured virality is a shortcut, not a strategy.</p>
                  <div className="hp-svc-pills">
                    <span className="hp-svc-pill">Social Media Management</span>
                    <span className="hp-svc-pill">Content Strategy</span>
                    <span className="hp-svc-pill">Community Building</span>
                    <span className="hp-svc-pill">Halal Growth</span>
                  </div>
                  <div className="hp-svc-prices">
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Starter</div><div className="hp-svc-price-val">$349</div></div>
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Growth</div><div className="hp-svc-price-val">$549</div></div>
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Authority</div><div className="hp-svc-price-val">$1,249</div></div>
                  </div>
                </div>
              </div>

              {/* Coaching panel */}
              <div className="hp-svc-panel hp-svc-panel-dark">
                <div className="hp-svc-num" style={{ color: 'rgba(245,240,232,.04)' }}>03</div>
                <div className="hp-svc-content">
                  <div className="hp-svc-icon">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                  </div>
                  <div className="hp-svc-tag">Coaching</div>
                  <h3 className="hp-svc-title">ISLAMify<br />Your Business</h3>
                  <p className="hp-svc-desc">Our signature coaching programme for Muslim entrepreneurs — embedding Islamic values into every business decision, from pricing to product design.</p>
                  <div className="hp-svc-pills">
                    <span className="hp-svc-pill">Group Sessions</span>
                    <span className="hp-svc-pill">Private Coaching</span>
                    <span className="hp-svc-pill">ISLAMify Course</span>
                  </div>
                  <div className="hp-svc-prices">
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Group</div><div className="hp-svc-price-val">₹1,000</div></div>
                    <div className="hp-svc-price-item"><div className="hp-svc-price-tier">Private</div><div className="hp-svc-price-val">₹10,000</div></div>
                  </div>
                </div>
              </div>

            </div>{/* /track */}

            {/* progress dots */}
            <div className="hp-svc-nav" id="hp-svc-nav">
              <div className="hp-svc-dot hp-svc-dot-intro on" data-i="0" />
              <div className="hp-svc-dot" data-i="1" />
              <div className="hp-svc-dot" data-i="2" />
              <div className="hp-svc-dot" data-i="3" />
            </div>
          </div>
        </div>
      </div>

      {/* ══ MANIFESTO ══ */}
      <section className="hp-manifesto">
        <div className="hp-manifesto-inner">
          <span className="hp-manifesto-line" id="hp-ml1"><em>&ldquo;If growth</em></span>
          <span className="hp-manifesto-line" id="hp-ml2">costs integrity,</span>
          <span className="hp-manifesto-line" id="hp-ml3">it is <em>not growth.&rdquo;</em></span>
          <div className="hp-manifesto-attr" data-r="" style={{ opacity: 0 }}>
            <hr /><span>The W*HEED Manifesto — waheed.in</span><hr />
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="hp-process">
        <div className="hp-process-inner">
          <div className="hp-process-header" data-r="">
            <div>
              <div className="hp-section-eyebrow">How It Works</div>
              <h2 className="hp-s-title" style={{ fontSize: 'clamp(2.4rem,3.8vw,4rem)', marginTop: '.8rem' }}>
                Three steps to<br /><em>aligned growth</em>
              </h2>
            </div>
            <a href="#hp-cta" className="hp-text-link">Book a free consultation</a>
          </div>

          <div>
            <div className="hp-process-card" data-r="">
              <div>
                <div className="hp-process-num">01</div>
                <div className="hp-process-step-label">First Contact</div>
                <h3 className="hp-process-step-title">Free Consultation</h3>
                <p className="hp-process-step-desc">No pitch deck, no sales scripts. We want to understand your business, your values, and your goals before we say yes to anything.</p>
              </div>
              <div className="hp-process-right">
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">What to expect</div>
                  <div className="hp-process-detail-text">A 45-minute video call. We listen first. We&apos;ll ask about your business, audience, current digital situation, and what growth looks like for you.</div>
                </div>
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">Our commitment</div>
                  <div className="hp-process-detail-text">If we&apos;re not the right fit — or if your project conflicts with our principles — we&apos;ll say so honestly, and point you in the right direction.</div>
                </div>
              </div>
            </div>

            <div className="hp-process-card" data-r="">
              <div>
                <div className="hp-process-num">02</div>
                <div className="hp-process-step-label">Proposal</div>
                <h3 className="hp-process-step-title">Scope &amp; Proposal</h3>
                <p className="hp-process-step-desc">A clear, transparent proposal with fixed pricing or a scoped estimate. No hidden fees. You know exactly what you&apos;re paying for before anything starts.</p>
              </div>
              <div className="hp-process-right">
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">Fixed-price services</div>
                  <div className="hp-process-detail-text">Web design, social media, and coaching all have published tiered pricing. Choose your tier — that is your price. No surprises.</div>
                </div>
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">Project-based work</div>
                  <div className="hp-process-detail-text">Apps and custom software are scoped and quoted per project. We issue a detailed written proposal before any commitment is made.</div>
                </div>
              </div>
            </div>

            <div className="hp-process-card" data-r="">
              <div>
                <div className="hp-process-num">03</div>
                <div className="hp-process-step-label">Execution</div>
                <h3 className="hp-process-step-title">Build &amp; Deliver</h3>
                <p className="hp-process-step-desc">We build with intention and communicate throughout. Every milestone is reviewed together. After launch, we&apos;re still here — aligned for the long term.</p>
              </div>
              <div className="hp-process-right">
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">Regular touchpoints</div>
                  <div className="hp-process-detail-text">Weekly check-ins during active builds. You always know where the project stands. We raise issues early, not after the fact.</div>
                </div>
                <div className="hp-process-detail">
                  <div className="hp-process-detail-title">Post-launch</div>
                  <div className="hp-process-detail-text">We offer maintenance plans and are available long-term. A long-term relationship is worth more than a single invoice.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hp-process-spacer" />
        </div>
      </section>

      {/* ══ WORK ══ */}
      <section className="hp-work" id="hp-work-section">
        <div className="hp-work-inner">
          <div className="hp-work-header" data-r="">
            <div>
              <div className="hp-section-eyebrow">Selected Work</div>
              <h2 className="hp-s-title" style={{ fontSize: 'clamp(2.4rem,3.8vw,4rem)', marginTop: '.8rem' }}>
                Work built<br /><em>with intention</em>
              </h2>
            </div>
            <Link href="/work" className="hp-text-link">View all projects</Link>
          </div>
          <div>
            <div className="hp-work-row" data-r=""><div className="hp-work-n">001</div><div className="hp-work-title">Modest Fashion E-Commerce</div><div className="hp-work-cat">Web Design + Development</div><div className="hp-work-yr">2025</div></div>
            <div className="hp-work-row" data-r=""><div className="hp-work-n">002</div><div className="hp-work-title">Islamic Education Centre</div><div className="hp-work-cat">Social Media Marketing</div><div className="hp-work-yr">2025</div></div>
            <div className="hp-work-row" data-r=""><div className="hp-work-n">003</div><div className="hp-work-title">Halal Food Discovery App</div><div className="hp-work-cat">Mobile App — React Native</div><div className="hp-work-yr">2026</div></div>
            <div className="hp-work-row" data-r=""><div className="hp-work-n">004</div><div className="hp-work-title">Muslim Business Coaching Platform</div><div className="hp-work-cat">Custom Software + LMS</div><div className="hp-work-yr">2026</div></div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="hp-testimonials">
        <div className="hp-testimonials-inner">
          <div className="hp-test-header" data-r="">
            <div className="hp-section-eyebrow">What Clients Say</div>
            <h2 className="hp-test-hd">Trust earned through<br /><em>alignment</em></h2>
          </div>
          <div className="hp-test-track" id="hp-test-track">
            <div className="hp-test-card">
              <span className="hp-test-mark">&ldquo;</span>
              <p className="hp-test-body">Working with WAHEED felt different from any other agency. They asked us about our values before they asked us about our budget. That told us everything.</p>
              <div className="hp-test-author"><div className="hp-test-avatar">SA</div><div><div className="hp-test-name">Sister Amina</div><div className="hp-test-role">Founder, Modest Co.</div></div></div>
            </div>
            <div className="hp-test-card">
              <span className="hp-test-mark">&ldquo;</span>
              <p className="hp-test-body">They told us upfront what they wouldn&apos;t do — and that gave us more confidence than any portfolio ever could. Our website now reflects who we actually are.</p>
              <div className="hp-test-author"><div className="hp-test-avatar">BI</div><div><div className="hp-test-name">Brother Ibrahim</div><div className="hp-test-role">CEO, Nur Foods</div></div></div>
            </div>
            <div className="hp-test-card">
              <span className="hp-test-mark">&ldquo;</span>
              <p className="hp-test-body">The coaching programme didn&apos;t just help my business — it helped me think clearly about what growth actually means in the context of my deen. Invaluable.</p>
              <div className="hp-test-author"><div className="hp-test-avatar">FA</div><div><div className="hp-test-name">Fatima Al-Rashidi</div><div className="hp-test-role">Business Coach, Jeddah</div></div></div>
            </div>
            <div className="hp-test-card">
              <span className="hp-test-mark">&ldquo;</span>
              <p className="hp-test-body">Clear pricing, honest timelines, and they pushed back when our brief conflicted with our own values. That integrity is rare. We&apos;re long-term clients now.</p>
              <div className="hp-test-author"><div className="hp-test-avatar">MH</div><div><div className="hp-test-name">Mohammed H.</div><div className="hp-test-role">Director, Al-Amal Group</div></div></div>
            </div>
          </div>
          <div className="hp-test-hint">← drag to explore →</div>
        </div>
      </section>

      {/* ══ JOURNAL ══ */}
      <section className="hp-journal" id="hp-journal">
        <div className="hp-journal-inner">
          <div className="hp-journal-hdr" data-r="">
            <div>
              <div className="hp-section-eyebrow">From the Journal</div>
              <h2 className="hp-s-title" style={{ fontSize: 'clamp(2.4rem,3.8vw,4rem)', marginTop: '.8rem' }}>
                Perspectives on<br /><em>ethical business</em>
              </h2>
            </div>
            <Link href="/blog" className="hp-text-link">Read all articles</Link>
          </div>
          <div className="hp-journal-grid">
            <div className="hp-journal-card" data-r="">
              <div className="hp-journal-chip">Marketing Ethics</div>
              <div className="hp-journal-date">March 2026</div>
              <div className="hp-journal-title">Why We Refuse Viral Tactics — and What We Do Instead</div>
              <div className="hp-journal-excerpt">A clear-eyed look at why manufactured virality contradicts the Ihsan standard — and the ethical alternative we build campaigns around. Real growth, not noise.</div>
              <div className="hp-journal-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            </div>
            <div className="hp-journal-card" data-r="">
              <div className="hp-journal-chip">Web Development</div>
              <div className="hp-journal-date">February 2026</div>
              <div className="hp-journal-title">The True Cost of a Cheap Website</div>
              <div className="hp-journal-excerpt">Templated sites and overnight freelancers leave you exposed — technically and ethically. What intentional development actually looks like for Muslim businesses.</div>
              <div className="hp-journal-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            </div>
            <div className="hp-journal-card" data-r="">
              <div className="hp-journal-chip">Business Coaching</div>
              <div className="hp-journal-date">January 2026</div>
              <div className="hp-journal-title">ISLAMify Your Business — In Practice</div>
              <div className="hp-journal-excerpt">Beyond halal labelling — a framework for embedding Islamic values into every decision, from pricing to product design to the copy on your about page.</div>
              <div className="hp-journal-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHAT WE WON'T DO ══ */}
      <section className="hp-no-band">
        <div className="hp-no-inner">
          <div data-r="">
            <div className="hp-section-eyebrow">Our Principles</div>
            <h2 className="hp-no-title" style={{ marginTop: '.8rem' }}>What we will<br /><em>never do</em></h2>
          </div>
          <div data-r="">
            <p className="hp-no-body">Technical work is not ethically neutral. These exclusions apply regardless of the nature of the task requested — even when &ldquo;just building the website&rdquo;. We&apos;d rather be clear upfront than compromise later.</p>
            <div className="hp-no-tags">
              <span className="hp-no-tag">Gambling &amp; Betting</span>
              <span className="hp-no-tag">Alcohol Promotion</span>
              <span className="hp-no-tag">Adult Platforms</span>
              <span className="hp-no-tag">Riba-based Fintech</span>
              <span className="hp-no-tag">Crypto Scams</span>
              <span className="hp-no-tag">Dark UX Patterns</span>
              <span className="hp-no-tag">Deceptive Ad-tech</span>
              <span className="hp-no-tag">Fantasy Sports</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="hp-cta" id="hp-cta">
        <div className="hp-cta-inner">
          <span className="hp-cta-sub" data-r="">Ready to grow with intention?</span>
          <h2 className="hp-cta-title" id="hp-cta-title">
            Let&apos;s build<br />something<br /><em>aligned.</em>
          </h2>
          <a href="mailto:hello@waheed.in" className="hp-cta-link" data-r="">
            hello@waheed.in
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <div className="hp-cta-duaa" data-r="">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ</div>
          <div className="hp-cta-duaa-t" data-r="">&ldquo;My success is only through Allah&rdquo;</div>
        </div>
      </section>
    </>
  );
}
