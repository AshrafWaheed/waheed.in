'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { services, isLinkable } from '@/content/services';

/**
 * Top-level bar. `Services` is not in this list — it is a dropdown, not a link,
 * because there is no /services index page: the seven crafts live at
 * /services/[slug] and the trigger only opens the panel. Everything else here
 * is a plain destination.
 */
const LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/packages', label: 'Packages' },
  { href: '/blog',     label: 'Blog'     },
  { href: '/faq',      label: 'FAQs'     },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Nav({}: { blogPublic?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);   // mobile overlay
  const [drop, setDrop]         = useState(false);   // desktop services panel
  const pathname                = usePathname();
  const dropRef                 = useRef<HTMLLIElement | null>(null);
  /** Hover-out is delayed so the pointer can cross the gap to the panel. */
  const closeTimer              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onServices = pathname.startsWith('/services');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close both menus on navigation
  useEffect(() => { setOpen(false); setDrop(false); }, [pathname]);

  // Lock body scroll when the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape closes the dropdown; a pointer/focus landing outside it does too.
  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrop(false); };
    const onOutside = (e: Event) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [drop]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const hold  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDrop(true); };
  const relax = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDrop(false), 140);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}${open ? ' menu-open' : ''}`}>
        <div className="cnt nav-inner">

          {/* Logo */}
          <Link href="/" aria-label="Waheed home">
            <img
              src="/logo.png"
              alt="Waheed"
              className="nav-logo-img"
            />
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <Link href="/about" className={pathname.startsWith('/about') ? 'active' : ''}>About</Link>
            </li>

            <li
              className="nav-drop"
              ref={dropRef}
              onMouseEnter={hold}
              onMouseLeave={relax}
            >
              <button
                type="button"
                className={`nav-drop-trigger${onServices ? ' active' : ''}`}
                aria-expanded={drop}
                aria-haspopup="true"
                onClick={() => setDrop((d) => !d)}
              >
                Services
                <span className={`nav-caret${drop ? ' is-up' : ''}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {drop && (
                  <motion.div
                    className="nav-panel"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <ul className="nav-panel-list">
                      {services.map((s) => (
                        <li key={s.slug}>
                          {isLinkable(s) ? (
                            <Link
                              href={`/services/${s.slug}`}
                              className={`nav-panel-item${pathname === `/services/${s.slug}` ? ' active' : ''}`}
                            >
                              <span className="nav-panel-num">{s.num}</span>
                              <span className="nav-panel-text">
                                <span className="nav-panel-title">{s.navLabel}</span>
                                <span className="nav-panel-blurb">{s.navBlurb}</span>
                              </span>
                            </Link>
                          ) : (
                            /* Not an anchor at all — there is no page behind it,
                               and a disabled-looking link that still navigates
                               into a 404 is worse than plain text. The chip only
                               appears for crafts we are not selling yet; a sold
                               craft whose page is still being written is simply
                               dimmed until it exists. */
                            <span className="nav-panel-item is-soon" aria-disabled="true">
                              <span className="nav-panel-num">{s.num}</span>
                              <span className="nav-panel-text">
                                <span className="nav-panel-title">
                                  {s.navLabel}
                                  {s.soon && <span className="nav-soon">Coming soon</span>}
                                </span>
                                <span className="nav-panel-blurb">{s.navBlurb}</span>
                              </span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {LINKS.slice(2).map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={pathname.startsWith(href) ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs. Two actions, ranked: booking a call is the one we
              want, so it keeps the solid button; /contact stays reachable as a
              ghost for people who would rather write than talk. They collapse
              to the burger together below 1080px — see .nav-ctas. */}
          <div className="nav-ctas">
            <Link href="/contact" className="btn btn-sm nav-ghost">
              Let&apos;s talk
            </Link>
            <Link href="/book" className="btn btn-gold btn-sm nav-cta">
              Book a call →
            </Link>
          </div>

          {/* Burger */}
          <button
            className="burger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mob-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>

            {/* Always expanded on mobile — a second tap-to-open layer inside a
                menu the user already had to open is one gesture too many. */}
            <div className="mob-group">
              <p className="mob-group-label">Services</p>
              {services.map((s) =>
                isLinkable(s) ? (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="mob-sub"
                    onClick={() => setOpen(false)}
                  >
                    {s.navLabel}
                  </Link>
                ) : (
                  <span key={s.slug} className="mob-sub is-soon" aria-disabled="true">
                    {s.navLabel}
                    {s.soon && <span className="nav-soon">Coming soon</span>}
                  </span>
                ),
              )}
            </div>

            {LINKS.slice(2).map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}

            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="btn btn-gold"
              style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
            >
              Book a call →
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-outline"
              style={{ alignSelf: 'flex-start', marginTop: '.6rem' }}
            >
              Let&apos;s talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
