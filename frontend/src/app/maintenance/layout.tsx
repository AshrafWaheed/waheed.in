import type { Metadata } from 'next';

/**
 * `noindex` for the maintenance screen — same reasoning as
 * src/app/coming-soon/layout.tsx, which has the long version: the proxy
 * rewrites every public URL to this screen while maintenance is on, so the
 * directive has to ride on the response rather than live in robots.txt.
 */
export const metadata: Metadata = {
  title: 'Back shortly · WAHEED',
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
