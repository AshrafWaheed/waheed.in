import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hp-footer">
      <div className="hp-footer-grid">
        <div>
          <div className="hp-footer-logo">W<span>*</span>HEED</div>
          <p className="hp-footer-about">
            India&apos;s First Halal Digital Studio. Shariah-aligned web development, ethical marketing, and purpose-driven coaching for Muslim-led brands.
          </p>
          <div className="hp-footer-duaa">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ</div>
          <div className="hp-footer-duaa-t">&ldquo;My success is only through Allah&rdquo;</div>
        </div>

        <div>
          <div className="hp-footer-col-title">Services</div>
          <ul className="hp-footer-links">
            <li><Link href="/services">Web Design &amp; Dev</Link></li>
            <li><Link href="/services">Mobile Apps</Link></li>
            <li><Link href="/services">Custom Software</Link></li>
            <li><Link href="/services">Social Media</Link></li>
            <li><Link href="/services">Business Coaching</Link></li>
            <li><Link href="/services">ISLAMify Course</Link></li>
          </ul>
        </div>

        <div>
          <div className="hp-footer-col-title">Studio</div>
          <ul className="hp-footer-links">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/about">Manifesto</Link></li>
            <li><Link href="/about">What We Don&apos;t Do</Link></li>
            <li><Link href="/work">Case Studies</Link></li>
            <li><Link href="/blog">Journal</Link></li>
          </ul>
        </div>

        <div>
          <div className="hp-footer-col-title">Legal</div>
          <ul className="hp-footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
          <div style={{ marginTop: "2rem" }}>
            <div className="hp-footer-col-title">Contact</div>
            <ul className="hp-footer-links">
              <li><a href="mailto:hello@waheed.in">hello@waheed.in</a></li>
              <li><a href="https://waheed.in">waheed.in</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hp-footer-bottom">
        <div className="hp-footer-copy">© 2026 WAHEED — Halal Digital Studio · waheed.in · Ashraf Waheed</div>
        <div className="hp-footer-arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
      </div>
    </footer>
  );
}
