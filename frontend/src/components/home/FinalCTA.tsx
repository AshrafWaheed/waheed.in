import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="cta-banner">
      <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
        <span className="eyebrow-v2 center">Let&apos;s build something meaningful</span>
        <h2 className="cta-h reveal">
          Ready to grow with <em>clarity and Barakah?</em>
        </h2>
        <p className="cta-p reveal delay-1">
          A 30-minute fit call. We review every application personally and respond within
          24 hours, in sha Allah.
        </p>
        <div className="cta-acts reveal delay-2">
          <Link href="/contact" className="btn btn-gold">
            Apply for a Free Discovery Call →
          </Link>
        </div>
      </div>
    </section>
  );
}
