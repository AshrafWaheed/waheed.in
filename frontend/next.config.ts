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
  // sharp is a native module used by the upload route handler — keep it external
  // so Turbopack doesn't try to bundle it.
  serverExternalPackages: ["sharp"],

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
