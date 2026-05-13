import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      // Serve the static moyaki-style swap engine at /swap
      { source: "/swap", destination: "/swap.html" },
      // The Monitain — interactive tier-finder + climb visualization
      { source: "/monitain", destination: "/monitain.html" },
    ];
  },
};

export default nextConfig;
