import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // force root to this project
    root: process.cwd(),
  },
};

export default nextConfig;
