import "./globals.css";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";

export const metadata = {
  title: "MoniStake",
  description: "Stake MONI • Pool-based rewards • Monad",
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
