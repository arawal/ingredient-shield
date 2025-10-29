import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Exclude Supabase Edge Functions from build process
  distDir: 'dist',
  output: 'standalone'
};

export default nextConfig;
