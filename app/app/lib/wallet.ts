import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";

export const monad = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 143),
  name: "Monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.monad.xyz"] },
    public: { http: [process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "MonadScan", url: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://monadscan.com" },
  },
} as const;

export const chains = [monad as any];

export const wagmiConfig = getDefaultConfig({
  appName: "MoniStake",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: chains as any,
  transports: {
    [monad.id]: http(monad.rpcUrls.default.http[0]),
  },
  ssr: true,
});
