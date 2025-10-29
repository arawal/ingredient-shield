import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Exclude Supabase Edge Functions from webpack build
    config.externals = [...(config.externals || []), { 'std/http/server': 'std/http/server' }];
    return config;
  },
};

export default nextConfig;
