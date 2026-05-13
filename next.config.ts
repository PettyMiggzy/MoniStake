import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      // trade.monimonad.com — dedicated swap subdomain. Root path lands
      // straight on the swap form so whales coming via MetaMask deep-link
      // don't see the marketing site first.
      {
        source: "/",
        has: [{ type: "host", value: "trade.monimonad.com" }],
        destination: "/swap.html",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "trade.monimonad.com" }],
        destination: "/swap.html",
      },
      // Default routes (main domain)
      { source: "/swap", destination: "/swap.html" },
      { source: "/pantheon", destination: "/pantheon.html" },
      { source: "/contact", destination: "/contact.html" },
    ];
  },
};

export default nextConfig;
