import Link from "next/link";
import ArabicText from "@/components/ui/ArabicText";

const SERVICES_LINKS = [
  { label: "Web & Mobile Development", href: "/services/web-development" },
  { label: "Social Media Marketing",   href: "/services/social-media" },
  { label: "Business Coaching",        href: "/services/coaching" },
  { label: "View Pricing",             href: "/services" },
];

const COMPANY_LINKS = [
  { label: "About",             href: "/about" },
  { label: "Our Work",          href: "/work" },
  { label: "Blog",              href: "/blog" },
  { label: "Shariah Standards", href: "/shariah" },
  { label: "Privacy Policy",    href: "/privacy" },
];

const SOCIAL: { label: string; href: string; path: string }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/waheed.in",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/waheed_in",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/waheed-in",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@waheed.in",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A2E22] text-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-[var(--cream)]/10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-[var(--font-cormorant)] text-3xl font-bold tracking-wide mb-1">
              W<span className="text-[var(--yellow)]">*</span>HEED
            </p>
            <p className="font-[var(--font-dm-sans)] text-xs text-[var(--cream)]/50 uppercase tracking-widest mb-5">
              India&apos;s First Halal Digital Studio
            </p>
            <p className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/60 leading-relaxed mb-7 max-w-xs">
              We help Muslim-led brands grow online with integrity — no shortcuts, no compromises.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[var(--cream)]/40 hover:text-[var(--yellow)] transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={18}
                    height={18}
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[var(--cream)]/35 mb-5">
              Services
            </p>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/65 hover:text-[var(--cream)] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[var(--cream)]/35 mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/65 hover:text-[var(--cream)] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[var(--cream)]/35 mb-5">
              Contact
            </p>

            <Link
              href="/contact"
              className="inline-block mb-6 rounded-lg bg-[var(--yellow)] px-5 py-2.5 font-[var(--font-dm-sans)] font-semibold text-sm text-[var(--text-dark)] hover:bg-[var(--yellow-soft)] transition-colors duration-200"
            >
              Book a Free Call
            </Link>

            <div className="space-y-2">
              <p className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/60">
                <a
                  href="mailto:hello@waheed.in"
                  className="hover:text-[var(--cream)] transition-colors duration-150"
                >
                  hello@waheed.in
                </a>
              </p>
              <p className="font-[var(--font-dm-sans)] text-sm text-[var(--cream)]/60">
                India — Serving clients worldwide
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="font-[var(--font-dm-sans)] text-xs text-[var(--cream)]/35 order-2 md:order-1">
            © {new Date().getFullYear()} WAHEED. All rights reserved.
          </p>

          <div className="flex flex-col items-center gap-1 order-1 md:order-2">
            <ArabicText size="lg" opacity={0.5}>
              رَبَّنَا تَقَبَّلْ مِنَّا
            </ArabicText>
            <p className="font-[var(--font-dm-sans)] text-[10px] text-[var(--cream)]/30 italic tracking-wide">
              &ldquo;Our Lord, accept from us.&rdquo; — Al-Baqarah 2:127
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
