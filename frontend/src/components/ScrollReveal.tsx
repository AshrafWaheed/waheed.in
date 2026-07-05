'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: '0px 0px 60px 0px' },
    );

    // Let Next.js finish rendering before observing
    const init = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => obs.observe(el));
    }, 80);

    // Safety net: force-reveal anything still hidden after 2s
    const safety = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible');
      });
    }, 2000);

    return () => {
      clearTimeout(init);
      clearTimeout(safety);
      obs.disconnect();
    };
  }, [pathname]);

  return null;
}
