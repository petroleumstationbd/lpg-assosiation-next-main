import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.petroleumstationbd.com',
        pathname: '/**',
      },
      // YouTube thumbnail fallback
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      // Some links return i.ytimg.com as well (optional but recommended)
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
