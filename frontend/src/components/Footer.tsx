import Link from 'next/link';

const NAV = [
  { label: 'About',    href: '/about'    },
  { label: 'Services', href: '/services' },
  { label: 'FAQs',     href: '/faq'      },
  { label: 'Apply',    href: '/contact'  },
];

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/bintk.waheed/' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/waheedhq/' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="cnt">
        <div className="footer-grid">

          {/* Left — brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Waheed"
              className="footer-logo-img"
            />
            <p className="footer-tagline">
              For halal brands that refuse to compromise their values
            </p>
            <div className="footer-meta">
              <span>
                <b>Email</b>
                {' · '}
                <a href="mailto:info@waheed.in">INFO@WAHEED.IN</a>
              </span>
            </div>
          </div>

          {/* Right — nav columns */}
          <div className="footer-right">
            <div className="footer-cols">
              <div className="footer-col">
                <span className="footer-col-title">Navigation</span>
                {NAV.map((l) => (
                  <Link key={l.label} href={l.href}>{l.label}</Link>
                ))}
              </div>
              <div className="footer-col">
                <span className="footer-col-title">Follow Us</span>
                {SOCIAL.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 Waheed Digital Studio
            {' · '}
            <Link href="/privacy">Privacy</Link>
            {' · '}
            <Link href="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
