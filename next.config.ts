import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      // Serve the static moyaki-style swap engine at /swap
      { source: "/swap", destination: "/swap.html" },
    ];
  },
};

export default nextConfig;
