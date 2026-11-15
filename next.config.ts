import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reuse Turbopack work across local builds while retaining type checks.
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
