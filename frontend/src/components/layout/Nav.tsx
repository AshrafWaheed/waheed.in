"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/about" },
  { label: "Work",     href: "/work" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
];

// Stagger wrapper for mobile links
const linkListVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const linkItemVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen,   setIsOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#2a4d38]/95 backdrop-blur-md py-[0.9rem] shadow-lg"
            : "bg-[#2a4d38]/70 backdrop-blur-sm py-[1.4rem]",
        ].join(" ")}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="font-[var(--font-cormorant)] text-[1.65rem] font-bold tracking-wide leading-none text-[var(--cream)] hover:opacity-90 transition-opacity"
            aria-label="WAHEED — Home"
          >
            W<span style={{ color: "var(--yellow)" }}>*</span>HEED
          </Link>

          {/* ── Desktop links ── */}
          <ul className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      "relative text-sm font-medium font-[var(--font-dm-sans)] transition-colors duration-150 pb-0.5",
                      active
                        ? "text-[var(--cream)]"
                        : "text-[var(--cream)]/70 hover:text-[var(--cream)]",
                    ].join(" ")}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-[var(--yellow)] rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center justify-center bg-[var(--yellow)] text-[var(--text-dark)] text-sm font-semibold font-[var(--font-dm-sans)] px-5 py-2.5 rounded-sm hover:bg-[var(--yellow-soft)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yellow)]"
          >
            Book a Free Consultation
          </Link>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[var(--cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yellow)] rounded-sm"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 bg-[#2a4d38] flex flex-col items-center justify-center gap-2 px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28 }}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-[var(--font-cormorant)] text-2xl font-bold tracking-wide text-[var(--cream)] mb-8"
              onClick={() => setIsOpen(false)}
            >
              W<span style={{ color: "var(--yellow)" }}>*</span>HEED
            </Link>

            {/* Staggered links */}
            <motion.ul
              className="flex flex-col items-center gap-0 w-full max-w-xs"
              variants={linkListVariants}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    variants={linkItemVariants}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={[
                        "block w-full text-center py-3.5 font-[var(--font-cormorant)] text-3xl font-semibold",
                        "border-b border-[var(--cream)]/10 transition-colors duration-150",
                        active
                          ? "text-[var(--yellow)]"
                          : "text-[var(--cream)]/80 hover:text-[var(--cream)]",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* CTA */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-8 inline-flex items-center justify-center bg-[var(--yellow)] text-[var(--text-dark)] font-semibold font-[var(--font-dm-sans)] px-8 py-4 rounded-sm hover:bg-[var(--yellow-soft)] transition-colors duration-200 text-base"
            >
              Book a Free Consultation
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
