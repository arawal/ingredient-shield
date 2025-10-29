import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Supabase Edge Functions from build process
  distDir: '.next',
  output: 'standalone',
};

export default nextConfig;
