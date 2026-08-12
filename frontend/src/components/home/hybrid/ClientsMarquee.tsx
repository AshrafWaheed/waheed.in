'use client';

/**
 * ClientsMarquee — a "trusted by" client logo wall on the homepage.
 *
 * The four client logos ship in clashing palettes and opposite polarities
 * (blue, red, black-on-white, white-on-transparent, gold-on-black), so raw
 * they can never read as one row on a single background. Each is instead
 * rendered as a uniform ivory silhouette via CSS `mask` — the box is tinted and
 * the logo's own alpha is the mask — giving a cohesive monochrome wall that also
 * keeps the strict teal+gold palette intact. Hover lifts a single logo to full
 * ivory. Copy/assets: `clients` in content/home.ts. Loops via <Marquee>.
 */
import Marquee from '@/components/motion/Marquee';
import { clients } from '@/content/home';
import type { CSSProperties } from 'react';

export default function ClientsMarquee() {
  return (
    <section className="cl" data-section-color="dark">
      <p className="cl-kicker">Trusted by mission-driven teams</p>
      <Marquee speed={30}>
        {clients.map((c) => (
          <span key={c.name} className="cl-item">
            <span
              className="cl-logo"
              role="img"
              aria-label={c.name}
              style={{ '--logo': `url(${c.src})`, '--ar': c.ar } as CSSProperties}
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
