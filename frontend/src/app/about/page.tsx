import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:       'About — WAHEED',
  description: 'Built for brands that refuse to compromise. The founding story and team behind Waheed Digital Studio.',
};

const FOUNDER = {
  label:  'Founder',
  role:   'Founder · Tech Engineer & Strategist',
  topCls: '',
  bio:    'Brings sleek, functional, high-performing sites, apps, and custom software to life. With years of experience across the halal digital industry, developed a deep understanding of halal digital infrastructure and what Muslim brands truly need to thrive online. The approach: clean code, clear intent, and excellence in every build.',
  skills: ['Web Development', 'Digital Strategy', 'React', 'Laravel', 'Next.js'],
};

const CO_FOUNDER = {
  label:  'Co-Founder',
  role:   'Co-Founder · Branding & Marketing',
  topCls: 'gold-top',
  bio:    'Brings words to life through strategic, meaningful messaging. Crafts brand voices that are grounded in Islamic values, authentic to their audience, and clear in their positioning. The strength: understanding the Muslim consumer mindset and translating it into content that connects and converts.',
  skills: ['Brand Strategy', 'Copywriting', 'Social Media', 'Content Planning'],
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
        <div className="team-card-skills">
          {member.skills.map((s) => (
            <span key={s} className="skill-chip">{s}</span>
          ))}
        </div>
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
                We Saw the Same Gap — Again and Again.
              </h2>
              <p className="reveal delay-2">
                Powerful halal businesses and Muslim organisations with big visions — but very
                little strategic digital infrastructure to support them in a way that aligns with
                Islamic values.
              </p>
              <p className="reveal delay-2">
                Websites that didn&apos;t convert because they didn&apos;t offer a simple experience
                that helped the audience get their answers. Social media content that lacked
                positioning because teams thought speaking to everyone was a good approach.
              </p>
              <p className="reveal delay-3">
                Growth strategies that felt disconnected from Barakah because they forced founders
                to lower their integrity for the sake of sales.
              </p>
              <blockquote className="about-blockquote reveal delay-3">
                We deeply understand that you want a website that converts and content that truly
                connects with your ideal audience — all without compromising your principles, your
                modesty, or your peace of mind.
              </blockquote>
              <p className="reveal delay-3">
                Today, we lead Waheed as a digital solutions studio rooted in Islamic values and
                guided by the principle of Ihsan (excellence).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Cards ── */}
      <section className="sec" style={{ background: '#F7F3ED' }}>
        <div className="cnt">
          <div style={{ maxWidth: 560, margin: '0 auto 2.5rem', textAlign: 'center' }}>
            <span className="lbl reveal">The People</span>
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
              The People Behind Waheed
            </h2>
            <p className="reveal delay-2" style={{ fontSize: '.9rem', color: '#6B6B6B' }}>
              A dedicated team committed to craft, clarity, and excellence.
            </p>
          </div>

          <div className="team-cards">
            <TeamCard member={FOUNDER} />
            <TeamCard member={CO_FOUNDER} />
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
