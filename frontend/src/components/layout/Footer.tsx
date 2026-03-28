import Link from "next/link";
import ArabicText from "@/components/ui/ArabicText";

const footerLinks = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
  ],
  Services: [
    { label: "Brand Strategy", href: "/services/brand-strategy" },
    { label: "Web Design", href: "/services/web-design" },
    { label: "Content", href: "/services/content" },
    { label: "Coaching", href: "/services/coaching" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shariah Compliance", href: "/shariah" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--green-dark)] text-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--cream)]/10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-[var(--font-cormorant)] text-2xl font-bold tracking-wide mb-3">
              WAHEED
            </p>
            <p className="text-sm text-[var(--cream)]/60 leading-relaxed max-w-xs">
              India&apos;s first Halal Digital Studio. Growth with integrity, by design.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--cream)]/40 mb-4">
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--cream)]/70 hover:text-[var(--cream)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row — duaa */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--cream)]/40">
            © {new Date().getFullYear()} WAHEED. All rights reserved.
          </p>
          <ArabicText opacity={0.5} className="text-lg">
            رَبَّنَا تَقَبَّلْ مِنَّا
          </ArabicText>
          <p className="text-xs text-[var(--cream)]/40 italic">
            &ldquo;Our Lord, accept from us.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
