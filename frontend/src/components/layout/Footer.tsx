import Link from 'next/link';

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/waheed.in',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/waheed_in',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/waheed-in',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@waheed.in',
    path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A2E22]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[rgba(245,240,232,0.08)]">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-[var(--font-cormorant)] text-3xl font-semibold text-[var(--cream)]">
              W<span className="text-[var(--yellow)]">*</span>HEED
            </p>
            <p className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.5)] italic leading-relaxed mt-3 max-w-xs">
              One intention. One standard. One way — aligned.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL.map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[rgba(245,240,232,0.35)] hover:text-[var(--yellow)] transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,232,0.3)] mb-5">
              Services
            </p>
            <ul className="space-y-3 list-none">
              {[
                'Web Design & Dev',
                'Mobile Apps',
                'Custom Software',
                'Social Media Marketing',
                'Business Coaching',
                'ISLAMify Course',
              ].map((l) => (
                <li key={l}>
                  <Link
                    href="/services"
                    className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.5)] hover:text-[var(--cream)] transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,232,0.3)] mb-5">
              Studio
            </p>
            <ul className="space-y-3 list-none">
              {[
                { l: 'About', h: '/about' },
                { l: 'Our Work', h: '/work' },
                { l: 'Blog', h: '/blog' },
                { l: 'Contact', h: '/contact' },
                { l: 'Privacy Policy', h: '/privacy' },
                { l: 'Terms of Service', h: '/terms' },
              ].map(({ l, h }) => (
                <li key={h}>
                  <Link
                    href={h}
                    className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.5)] hover:text-[var(--cream)] transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,232,0.3)] mb-5">
              Get in Touch
            </p>
            <Link
              href="/contact"
              className="block font-[var(--font-dm-sans)] text-sm font-medium bg-[var(--yellow)] text-[var(--text-dark)] text-center px-5 py-2.5 rounded-full hover:bg-[#f0d46a] transition-colors mb-5"
            >
              Book a Free Consultation
            </Link>
            <p className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.5)]">
              <a href="mailto:hello@waheed.in" className="hover:text-[var(--cream)] transition-colors">
                hello@waheed.in
              </a>
            </p>
            <p className="font-[var(--font-dm-sans)] text-sm text-[rgba(245,240,232,0.4)] mt-2">
              India — serving Muslim businesses globally
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[var(--font-dm-sans)] text-xs text-[rgba(245,240,232,0.25)] order-2 md:order-1">
            © 2026 WAHEED. All rights reserved.
          </p>
          <div className="flex flex-col items-center order-1 md:order-2">
            <p className="font-[var(--font-amiri)] text-sm text-[rgba(245,240,232,0.35)]" lang="ar" dir="rtl">
              رَبَّنَا تَقَبَّلْ مِنَّا
            </p>
            <p className="font-[var(--font-dm-sans)] text-[10px] text-[rgba(245,240,232,0.2)] italic mt-0.5">
              &ldquo;Our Lord, accept from us.&rdquo; — Al-Baqarah 2:127
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
