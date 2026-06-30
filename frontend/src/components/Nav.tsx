'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const LINKS = [
  { href: '/about',    label: 'About'    },
  { href: '/story',    label: 'Our Story' },
  { href: '/services', label: 'Services' },
  { href: '/faq',      label: 'FAQs'     },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname                = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
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
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={pathname.startsWith(href) ? 'active' : ''}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link href="/contact" className="btn btn-teal btn-sm nav-cta">
            Apply →
          </Link>

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

            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-gold"
              style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
            >
              Apply for a Discovery Call →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
