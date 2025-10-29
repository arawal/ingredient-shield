import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  typescript: {
    // Don't run type checking during build - we'll run it separately
    ignoreBuildErrors: true
  }
};

export default nextConfig;
