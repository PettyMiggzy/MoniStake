import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";

// Default WalletConnect project ID. NEXT_PUBLIC_* values are exposed to
// the client anyway — there are no secrets here. The fallback exists so
// the build doesn't crash on a fresh Netlify/Vercel deploy where the
// operator forgot to set the env var. To override, set
// NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in the host's environment.
const DEFAULT_WALLETCONNECT_PROJECT_ID =
  "89d7a1882c0fa9a5bbe0a58accafc100";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  DEFAULT_WALLETCONNECT_PROJECT_ID;

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
  appName: "MONI",
  projectId,
  chains: chains as any,
  transports: {
    [monad.id]: http(monad.rpcUrls.default.http[0]),
  },
  ssr: true,
});
