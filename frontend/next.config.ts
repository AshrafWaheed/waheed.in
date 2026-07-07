import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp is a native module used by the upload route handler — keep it external
  // so Turbopack doesn't try to bundle it.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
