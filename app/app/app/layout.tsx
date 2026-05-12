import "./globals.css";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monistake.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MoniStake · Lock $MONI, Earn $MONI",
  description:
    "Stake $MONI on Monad. Pool-based rewards from donations + fee flow. Lock 30 / 90 / 180 / 365 days. Early unstake routes to buyback + reward pool. CTO-era staking for the Yeti.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "MoniStake · Stake $MONI on Monad",
    description: "Lock the Yeti. Earn the Yeti. Pool-based rewards from fee flow.",
    images: [{ url: "/Moni.png", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoniStake · Stake $MONI",
    description: "Lock the Yeti. Earn the Yeti.",
    images: ["/Moni.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
