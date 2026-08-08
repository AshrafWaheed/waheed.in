import type { Metadata } from 'next';
import StackButton from '@/components/ui/StackButton';

export const metadata: Metadata = {
  title: 'Design lab · WAHEED Admin',
  robots: { index: false, follow: false },
};

/**
 * The redesign preview bench.
 *
 * Components from the Figma rebuild land here first so they can be hovered and
 * clicked on a real page before any of them is mounted on the public site.
 * Behind the admin session guard, `noindex`, and disallowed in robots.txt —
 * three reasons the public will never see a half-migrated component.
 *
 * Every panel below states the ground it is standing on, because these pieces
 * are being designed for a dark site with light sections in it, and "does the
 * outline survive on white" is exactly the question that gets answered too
 * late otherwise.
 */

const DARK = '#1A363D';
const CARD = '#0F4B5A';

function Bench({
  label,
  bg,
  children,
}: {
  label: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '.68rem',
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--rd-teal)',
          marginBottom: '.5rem',
        }}
      >
        {label}
      </p>
      <div
        style={{
          background: bg,
          border: '1px solid var(--rd-border)',
          borderRadius: 10,
          padding: '2.6rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem 2.4rem',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function DesignLabPage() {
  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1 className="adm-h1">Design lab</h1>
          <p className="adm-sub">
            Redesign components, previewed before they are mounted anywhere. Nothing on this page
            is live on the public site.
          </p>
        </div>
      </header>

      <section className="adm-card" style={{ padding: '1.6rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            color: '#254851',
            fontWeight: 500,
            marginBottom: '.4rem',
          }}
        >
          StackButton
        </h2>
        <p className="adm-sub" style={{ marginBottom: '1.6rem' }}>
          Three plates — white behind blue behind gold — offset up-and-right at rest. Hover
          collapses the offsets and hands the plates to your cursor: dead-centre is a plain gold
          pill, and moving toward an edge pulls them out on that side, the white travelling twice
          as far as the blue. Move slowly across one to see the parallax.
        </p>

        <Bench label={`On the dark ground · ${DARK}`} bg={DARK}>
          <StackButton href="/book">Book a call</StackButton>
          <StackButton href="/contact" arrow>
            Talk to us
          </StackButton>
          <StackButton href="/packages" size="sm">
            See our packages
          </StackButton>
        </Bench>

        <Bench label={`On a card · ${CARD}`} bg={CARD}>
          <StackButton href="/contact">Contact us</StackButton>
          <StackButton href="/contact" size="sm" arrow>
            Contact us
          </StackButton>
        </Bench>

        <Bench label="On a light section · #FFFFFF" bg="#FFFFFF">
          <StackButton href="/contact">Contact us</StackButton>
          <StackButton>Subscribe</StackButton>
          <StackButton disabled>Disabled</StackButton>
        </Bench>

        <p className="adm-note" style={{ marginTop: '1.2rem' }}>
          Keyboard: tab to a button and the plates collapse to centre — focus has no coordinates to
          pull toward, so centring is the honest answer. With{' '}
          <code>prefers-reduced-motion</code> the plates stay pinned at their rest offsets and the
          face darkens on hover instead of anything moving.
        </p>
      </section>
    </div>
  );
}
