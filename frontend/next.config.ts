import type { NextConfig } from "next";

// Baseline security headers applied to every response. HSTS is intentionally
// left to nginx (it terminates TLS and owns the cert/domain).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Build output dir. Overridable via env so a throwaway `next dev` can use an
  // isolated dir (NEXT_DIST_DIR=.next-dev) and never clobber the live PM2 `.next`.
  // Prod build/start leave the env unset → default `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Native modules used server-side — keep them external so the bundler
  // doesn't try to pack them: sharp (image uploads), better-sqlite3 (registrations).
  serverExternalPackages: ["sharp", "better-sqlite3"],

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      // /services was the packages page until the seven crafts took the
      // namespace. Permanent, because the old URL is indexed and linked; the
      // match is exact, so /services/<slug> is untouched by it.
      { source: "/services", destination: "/packages", permanent: true },
    ];
  },
};

export default nextConfig;
