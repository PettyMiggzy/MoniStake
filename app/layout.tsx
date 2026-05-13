import "./globals.css";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monistake.vercel.app";

const description =
  "MONI is the purple yeti of Monad — a 100% community-run (CTO) meme token on Monad mainnet. Buy $MONI through the universal Monorail swap, climb the Monitain tier system, mint community art via the Forge, and join the Pantheon of Monanimals. Built by the nads, for the nads.";

const keywords = [
  "MONI",
  "MONI Monad",
  "$MONI",
  "MONI token",
  "MONI coin",
  "MONI yeti",
  "Monad yeti",
  "Monad meme coin",
  "Monad meme token",
  "Monistake",
  "MONI staking",
  "Monitain",
  "Monanimals",
  "Monanimal",
  "Molandak",
  "Chog",
  "Moyaki",
  "Mouch",
  "Salmonad",
  "Monadverse",
  "Monad community",
  "Monad CTO",
  "Monad mainnet",
  "Monad memecoin",
  "Pit Viper yeti",
  "Capricorn V3",
  "Monorail Monad",
  "nad.fun",
  "Crust Finance",
  "MONI swap",
  "buy MONI",
  "MONI chart",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MONI · The Yeti of Monad · Buy $MONI on Monad Mainnet",
    template: "%s · MONI",
  },
  description,
  keywords,
  applicationName: "MONI",
  authors: [{ name: "MONI Community · CTO", url: siteUrl }],
  generator: "Next.js",
  publisher: "MONI · Community",
  category: "Cryptocurrency",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/Moni.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [{ url: "/Moni.png", sizes: "1024x1024", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MONI · The Yeti of Monad",
    title: "MONI · The Yeti of Monad · $MONI on Monad Mainnet",
    description,
    images: [
      {
        url: "/Moni.png",
        width: 1024,
        height: 1024,
        alt: "MONI — the purple yeti of Monad with Pit Vipers and iced-out chain",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@monadmonicto",
    creator: "@monadmonicto",
    title: "MONI · The Yeti of Monad",
    description:
      "Purple. Pit Vipers. Paint. Pump. CTO-run $MONI on Monad mainnet.",
    images: ["/Moni.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#a855f7",
    "msapplication-TileImage": "/Moni.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// === JSON-LD structured data ===
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MONI · The Yeti of Monad",
  alternateName: ["MONI", "$MONI", "MoniStake"],
  url: siteUrl,
  logo: `${siteUrl}/Moni.png`,
  description,
  foundingDate: "2025-12",
  sameAs: ["https://x.com/monadmonicto", "https://t.me/MoniTheYeti"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "admin@monimonad.com",
    contactType: "general",
    availableLanguage: ["English"],
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MONI",
  alternateName: "$MONI on Monad",
  url: siteUrl,
  description,
  inLanguage: "en-US",
  publisher: { "@type": "Organization", name: "MONI · Community" },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is MONI?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "MONI is the purple yeti of Monad — a 100% community-run (CTO) meme token on Monad mainnet. The contract is 0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777. Total supply is 1 billion. There is no team allocation: ownership was renounced and the project is fully community-driven.",
      },
    },
    {
      "@type": "Question",
      name: "How do I buy MONI on Monad?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Buy MONI through the universal Monorail aggregator swap on this site, on nad.fun, or directly on the capricorn-v3 MONI/WMON pool. Native MON is auto-wrapped to WMON when needed for the cleanest 1-hop route. The contract address is 0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777.",
      },
    },
    {
      "@type": "Question",
      name: "What chain is MONI on?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "MONI is deployed on Monad mainnet (chain ID 143). You'll need MON in your wallet for gas. Bridge from Ethereum or another chain via bridge.monad.xyz, or buy MON on a CEX that supports Monad.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Monitain?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The Monitain is MONI's tier system. Five tiers — Shrimp (0–100K), Sherpa (100K–500K), Climber (500K–1M), Diamond (1M–5M), and Emperor (5M+) — each unlock community perks: gallery priority, art bounties, OG mint list slots for the Yeti Squad NFT, and DAO whitelist.",
      },
    },
    {
      "@type": "Question",
      name: "Who are the Monanimals?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The Monanimals are the five canonical mascots of Monad — Molandak, Chog, Moyaki, Mouch, and Salmonad. They were born from community memes and the Monadverse lore. MONI is positioning as the sixth member, the yeti, joining the Pantheon. See the full lore on the /pantheon page.",
      },
    },
    {
      "@type": "Question",
      name: "Is MONI a rug? What about ownership?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "MONI is a community takeover (CTO) — the original deployer renounced and the project is run by community contributors. The contract has no mint function and ownership is renounced. Liquidity is on capricorn-v3. We post real updates, ship real code, and operate with full transparency.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.dexscreener.com" />
        <link rel="preconnect" href="https://pathfinder.monorail.xyz" />
        <link rel="preconnect" href="https://rpc.monad.xyz" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
