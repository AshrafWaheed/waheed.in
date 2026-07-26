'use client';

/**
 * Section-colour-aware nav (Outcrowd). Reads the `data-section-color="light|dark"`
 * of whichever section sits under the top of the viewport and mirrors it onto
 * `<html data-nav="...">` so nav CSS can invert. No-op on pages that have no
 * `[data-section-color]` sections, so it's safe to call anywhere.
 */
import { useEffect, useState } from 'react';

export type SectionColor = 'light' | 'dark';

export function useSectionNav(probe = 40): SectionColor {
  const [color, setColor] = useState<SectionColor>('light');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-color]'));
    if (!sections.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          const c: SectionColor = s.dataset.sectionColor === 'dark' ? 'dark' : 'light';
          setColor(c);
          document.documentElement.setAttribute('data-nav', c);
          break;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.removeAttribute('data-nav');
    };
  }, [probe]);

  return color;
}

/** Mountable no-render controller version of the hook. */
export default function SectionNav() {
  useSectionNav();
  return null;
}
