import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'About · WAHEED',
  description:
    'Built for brands that refuse to compromise. Meet the founders behind Waheed Digital Studio — our story, our values, and the halal-first standard behind every build.',
  path: '/about',
});

const FOUNDER = {
  label:  'Founder',
  role:   'Tech Engineer & Strategist',
  topCls: '',
  bio:    'The Founder had spent his early career at a tech company led by non-Muslims, where he was fired after facing islamophobic discrimination. By the Mercy of Allah, he was granted another means to earn rizq at the same halal advertising agency, starting as a web developer. He climbed to technical lead and ad operations, and the work — building products and understanding how advertising actually functions — gave him a deep, practical understanding of user experience and Muslim consumer behavior.',
};

const CO_FOUNDER = {
  label:  'Co-Founder',
  role:   'Brand & Marketing',
  topCls: 'gold-top',
  bio:    'The Co-Founder started her career trying to find work that wouldn’t force her to compromise her Islamic principles. She job-hopped between roles from 2022 onward, until in early 2024 she made the shift from onsite to remote work, earned a digital skills certification, and was hired at the agency as a social media manager. There, she learned how to read what actually earns trust online — audience psychology, halal-compliant content, and the small creative decisions that decide whether a Muslim audience feels spoken to or spoken at.',
};

function PersonIcon({ dark }: { dark?: boolean }) {
  const stroke = dark ? 'rgba(13,17,23,.6)' : 'rgba(255,255,255,.7)';
  return (
    <svg width="28" height="28" fill="none" stroke={stroke} strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function TeamCard({ member }: { member: typeof FOUNDER }) {
  return (
    <div className="team-card reveal">
      <div className={`team-card-top ${member.topCls}`}>
        <div className="team-av">
          <PersonIcon dark={!!member.topCls} />
        </div>
        <div>
          <div className="team-card-name">{member.label}</div>
          <div className="team-card-role">{member.role}</div>
        </div>
      </div>
      <div className="team-card-body">
        <p>{member.bio}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>

      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="cnt">
          <span className="lbl">About Waheed</span>
          <h1>
            Built for brands that{' '}
            <em>refuse to compromise.</em>
          </h1>
        </div>
      </div>

      {/* ── Founding Narrative ── */}
      <section className="sec" style={{ background: '#FFFDF9' }}>
        <div className="cnt">
          <div className="about-narrative">
            <div>
              <span className="eyebrow-v2">The Founding Story</span>
              <h2 className="about-narrative-h reveal delay-1">
                We Saw the Same Gap, Again and Again.
              </h2>
              <p className="reveal delay-2">
                Powerful halal businesses and Muslim organisations with big visions, but very
                little digital foundation to support them in a way that stays true to Islamic
                values.
              </p>
              <p className="reveal delay-2">
                Websites that didn&apos;t convert because they didn&apos;t offer a simple experience
                that helped the audience get their answers. Content that lacked positioning because
                teams thought speaking to everyone was a good approach. Growth strategies that felt
                disconnected from Barakah because they forced founders to lower their integrity for
                the sake of sales.
              </p>
              <blockquote className="about-blockquote reveal delay-3">
                You want a site that converts, content that truly connects with your ideal audience,
                a platform built for how your business actually runs, or a growth plan that moves
                the needle — without compromising your principles, your modesty, or your peace of
                mind?
                <span className="about-quote-answer">We got you.</span>
              </blockquote>
              <p className="reveal delay-3">
                Today, we lead Waheed as a transformational digital solutions studio rooted in
                Islamic values and guided by the principle of Ihsan (excellence).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The People & the Journey ── */}
      <section className="sec" style={{ background: '#F7F3ED' }}>
        <div className="cnt">
          <div style={{ maxWidth: 620, margin: '0 auto 2.5rem', textAlign: 'center' }}>
            <span className="lbl reveal">The People &amp; the Journey</span>
            <h2
              className="reveal delay-1"
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'clamp(1.7rem,2.5vw,2.2rem)',
                color:         '#254851',
                fontWeight:    500,
                marginBottom:  '.5rem',
              }}
            >
              The People &amp; the Journey Behind Waheed
            </h2>
            <p className="reveal delay-2" style={{ fontSize: '.9rem', color: '#6B6B6B' }}>
              Committed to craft, clarity, &amp; excellence.
            </p>
          </div>

          <div className="about-journey reveal delay-2">
            <p>
              Waheed was founded by two professionals who were both hired into the same halal
              advertising agency, one of the largest networks reaching Muslim consumers globally.
              The Founder came from software and strategy — the technical work of making something
              actually function. The Co-Founder came from brand and marketing — the words and
              instincts that make a business feel like itself, and the positioning that turns that
              feeling into trust people act on.
            </p>
          </div>

          <div className="team-cards">
            <TeamCard member={FOUNDER} />
            <TeamCard member={CO_FOUNDER} />
          </div>

          <div className="about-journey about-journey-outro reveal">
            <p>
              The realisation came when a handful of Muslim founders reached out to the Co-Founder,
              specifically asking for fully Shariah-compliant social media services. That opened her
              eyes to how much need there was for solutions built for faith-conscious brands. From
              there, she moved from social media alone into brand and marketing more broadly, seeking
              to serve Muslim brands and organisations with the right niyyah, a real understanding of
              Islamic values, and excellence in execution.
            </p>
            <p>
              Both of them watched the same problem play out, over and over: Muslim-led brands and
              ethical initiatives with real potential to reshape the Muslim economy, real revenue,
              and real ambition, stuck with digital work that either ignored their values or diluted
              them for the sake of growth. Neither of them was only looking at what this market could
              generate. They wanted to help these businesses get noticed and taken seriously as
              authorities in their industries, without ever having to compromise their values to get
              there. Beyond business, they wanted this to be a form of Da&apos;wah — to entrepreneurs,
              creators, educators, and leaders — proof that real growth is only possible with
              Allah&apos;s Tawfeeq and Barakah.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec" style={{ background: '#FFFDF9', textAlign: 'center' }}>
        <div className="cnt">
          <span className="eyebrow-v2 center reveal">Work with us</span>
          <h2
            className="reveal delay-1"
            style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(1.8rem,2.8vw,2.5rem)',
              color:         '#254851',
              fontWeight:    400,
              marginBottom:  '1.2rem',
              lineHeight:    1.1,
            }}
          >
            Ready to build something with <em style={{ fontStyle: 'italic', color: '#9c7d1c' }}>Barakah?</em>
          </h2>
          <Link href="/contact" className="btn btn-teal reveal delay-2">
            Apply for a Discovery Call →
          </Link>
        </div>
      </section>

    </main>
  );
}
