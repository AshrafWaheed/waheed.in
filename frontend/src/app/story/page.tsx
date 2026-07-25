import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Our Story · WAHEED',
  description:
    'Where conviction meets craft. The story behind Waheed Digital Studio and what we believe about halal business in the digital age.',
  path: '/story',
});

const MANIFESTO_BLOCKS = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    quote:  '"WAHEED was founded on a simple but difficult belief: that success does not require disobedience. That growth does not require deception. That modern business can exist without compromising values and faith."',
  },
  {
    arabic: null,
    quote:  '"We believe that Deen and duniya are not opposites. They are meant to be aligned. Ethics and Islamic principles are not obstacles to growth, they are the foundation of it."',
  },
  {
    arabic: null,
    quote:  '"We choose clarity over confusion, honesty over hype, principles over pressure, and long-term trust over short-term wins. We believe excellence (Ihsan) applies to code, content, contracts, and conduct."',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    quote:  '"WAHEED does not preach loudly. Our dawah is through honesty, consistency, refusing what is doubtful, and doing excellent work, while delivering impact that scales your business."',
  },
] as const;

export default function StoryPage() {
  return (
    <main>

      {/* ── Story Hero (split) ── */}
      <div className="story-hero">

        {/* Left, headline */}
        <div className="story-left">
          <svg
            className="geo"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={{ position: 'absolute', bottom: -20, left: -20, width: 220, opacity: .09, pointerEvents: 'none' }}
          >
            <g stroke="white" strokeWidth=".5" fill="none">
              <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" />
              <circle cx="100" cy="100" r="40" />
            </g>
          </svg>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow-v2 on-dark reveal">Our Story</span>
            <h1 className="story-h1 reveal delay-1">
              Where <em>conviction</em> meets craft.
            </h1>
            <p className="story-sub reveal delay-2">
              Waheed was not built by accident. It was built from a shared belief that
              Muslim brands deserve better digital support.
            </p>
          </div>
        </div>

        {/* Right, origin note */}
        <div className="story-right">
          <div className="story-right-inner reveal delay-2">
            <p className="story-arabic" lang="ar">
              وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
            </p>
            <h3 className="story-origin-h">The Beginning</h3>
            <p className="story-origin-p">
              Ashraf and Mardhiyya met through years of shared work in the halal digital
              space, building, advising, and shipping campaigns for Muslim-led brands.
              What began as professional collaboration grew into a shared mission.
            </p>
          </div>
        </div>

      </div>

      {/* ── Founding Narrative ── */}
      <section className="sec" style={{ background: 'var(--surface)' }}>
        <div className="cnt" style={{ maxWidth: 760 }}>
          <span className="eyebrow-v2 reveal">The Founding Story</span>
          <h2 className="story-section-h reveal delay-1">
            We Saw the Same Gap, Again and Again.
          </h2>
          <p className="story-p reveal delay-2">
            Powerful halal businesses and Muslim organisations with big visions, but very
            little strategic digital infrastructure to support them in a way that aligns
            with Islamic values.
          </p>
          <p className="story-p reveal delay-2">
            Websites that didn&apos;t convert because they didn&apos;t offer a simple
            experience that helped the audience get their answers. Social media content
            that lacked positioning because teams thought speaking to everyone was a good
            approach.
          </p>
          <p className="story-p reveal delay-3">
            Growth strategies that felt disconnected from Barakah because they forced
            founders to lower their integrity for the sake of sales.
          </p>
          <blockquote className="story-blockquote reveal delay-3">
            We deeply understand that you want a website that converts and content that
            truly connects with your ideal audience, all without compromising your
            principles, your modesty, or your peace of mind.
          </blockquote>
          <p className="story-p reveal delay-3">
            Today, we lead Waheed as a digital solutions studio rooted in Islamic values
            and guided by the principle of Ihsan (excellence).
          </p>
        </div>
      </section>

      {/* ── Manifesto Blocks ── */}
      <section className="sec" style={{ background: 'var(--surface-2)' }}>
        <div className="cnt">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="lbl reveal">The Manifesto</span>
            <h2 className="story-section-h reveal delay-1" style={{ textAlign: 'center', maxWidth: 480, margin: '.5rem auto 0' }}>
              What We Believe
            </h2>
          </div>

          <div className="manifesto-blocks">
            {MANIFESTO_BLOCKS.map((block, i) => (
              <div key={i} className={`mb reveal delay-${i + 1}`}>
                {block.arabic && (
                  <p className="mb-arabic" lang="ar">{block.arabic}</p>
                )}
                <p className="mb-q">{block.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner">
        <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow-v2 center">Build with us</span>
          <h2 className="cta-h reveal">
            Ready to do this <em>the right way?</em>
          </h2>
          <p className="cta-p reveal delay-1">
            Apply for a discovery call. We&apos;ll review your application personally and
            respond within 24 hours, in shā&apos; Allāh.
          </p>
          <div className="cta-acts reveal delay-2">
            <Link href="/contact" className="btn btn-teal">Apply Now →</Link>
            <Link href="/about"   className="btn btn-outline">Meet the Team →</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
