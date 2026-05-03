'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About',    href: '/about'   },
  { label: 'Services', href: '/services'},
  { label: 'Work',     href: '/work'    },
  { label: 'Blog',     href: '/blog'    },
  { label: 'Contact',  href: '/contact' },
];

export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        animate={{
          paddingTop:    scrolled ? '0.9rem' : '1.5rem',
          paddingBottom: scrolled ? '0.9rem' : '1.5rem',
          backgroundColor: scrolled ? 'rgba(42,77,56,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          boxShadow: scrolled ? '0 1px 0 rgba(245,240,232,0.07)' : 'none',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--cream)] tracking-tight"
        >
          W<span className="text-[var(--yellow)]">*</span>HEED
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-[var(--font-dm-sans)] text-sm tracking-wide transition-colors duration-200 ${
                  pathname === href ? 'text-[var(--yellow)]' : 'text-[var(--cream)] hover:text-[var(--yellow)]'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="font-[var(--font-dm-sans)] text-sm font-medium bg-[var(--yellow)] text-[var(--text-dark)] px-5 py-2 rounded-full hover:bg-[#f0d46a] transition-colors duration-200"
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-px bg-[var(--cream)]" />
          <span className="block w-6 h-px bg-[var(--cream)]" />
          <span className="block w-4 h-px bg-[var(--cream)]" />
        </button>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--cream)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <button
              className="absolute top-6 right-6 text-[var(--text-dark)] text-3xl font-light"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <ul className="flex flex-col items-center gap-8 list-none">
              {[...NAV_LINKS, { label: 'Book a Call', href: '/contact' }].map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={href}
                    className={`font-[var(--font-cormorant)] text-4xl font-light text-[var(--text-dark)] hover:text-[var(--green-dark)] transition-colors ${
                      pathname === href ? 'text-[var(--green-dark)]' : ''
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
