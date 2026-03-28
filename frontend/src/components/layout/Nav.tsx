"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--green-dark)]/95 backdrop-blur-sm py-3.5 shadow-md"
          : "bg-transparent py-5",
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-[var(--font-cormorant)] text-2xl font-bold tracking-wide text-[var(--cream)] leading-none">
            WAHEED
          </span>
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors duration-150"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="#contact">
          <Button variant="primary" size="sm">Work With Us</Button>
        </Link>
      </nav>
    </header>
  );
}
