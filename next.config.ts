import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Never block a production deploy on lint warnings/errors (they don't affect runtime).
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Vercel handles image optimization. Allow Supabase Storage + sample hosts.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
