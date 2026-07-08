// ── Site mode (runtime, admin-toggleable) ────────────────────────────────
// The two flags live in MySQL and are toggled from the admin portal
// (Site mode page). The Next.js proxy reads them on every request via
// getSiteMode(), so changes take effect without a rebuild.
//
//   maintenance → public sees the maintenance screen (takes precedence)
//   comingSoon  → public sees the coming-soon screen
//   neither     → site is fully live
//
// Admins always preview the real site regardless of these flags.

export type SiteMode = {
  comingSoon: boolean;
  maintenance: boolean;
};

const API_BASE = process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:8000/api';
const TTL_MS = 5_000;

// Module-level cache (persists across requests on the Node.js runtime). The
// last successful read is kept as a fallback if the backend blips.
let cached: { mode: SiteMode; at: number } | null = null;

// Ultimate fallback on a cold start with the backend unreachable. Errs on the
// side of hiding the site (coming-soon) rather than exposing an unfinished one.
const FALLBACK: SiteMode = { comingSoon: true, maintenance: false };

/** Current site mode, cached for a few seconds. Never throws. */
export async function getSiteMode(): Promise<SiteMode> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.mode;

  try {
    const res = await fetch(`${API_BASE}/site/mode`, { cache: 'no-store' });
    if (res.ok) {
      const data = (await res.json()) as { coming_soon?: unknown; maintenance?: unknown };
      const mode: SiteMode = {
        comingSoon: data.coming_soon === true,
        maintenance: data.maintenance === true,
      };
      cached = { mode, at: now };
      return mode;
    }
  } catch {
    // fall through to last-known / fallback
  }

  return cached?.mode ?? FALLBACK;
}
