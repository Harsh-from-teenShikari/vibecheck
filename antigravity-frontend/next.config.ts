import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.STANDALONE_BUILD ? 'standalone' : undefined,
};

export default nextConfig;
