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
  // Native modules used server-side — keep them external so the bundler
  // doesn't try to pack them: sharp (image uploads), better-sqlite3 (registrations).
  serverExternalPackages: ["sharp", "better-sqlite3"],

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
