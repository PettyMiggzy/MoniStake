import "./globals.css";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monistake.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MONI · The Yeti of Monad",
  description:
    "MONI the Yeti — purple spirit of the Monad community. CTO-run. Buy $MONI on the universal swap, view the live chart, read the lore.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "MONI · The Yeti of Monad",
    description: "Purple. Pit Vipers. Paint. Pump. CTO-run $MONI on Monad.",
    images: [{ url: "/Moni.png", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MONI · The Yeti of Monad",
    description: "Purple. Pit Vipers. Paint. Pump.",
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
