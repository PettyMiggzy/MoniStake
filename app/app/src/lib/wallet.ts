import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "143");
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.monad.xyz";
const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://monadscan.com";

export const monad = defineChain({
  id: CHAIN_ID,
  name: "Monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: "Explorer", url: EXPLORER_URL } },
});

export const wagmiConfig = getDefaultConfig({
  appName: "MoniStake",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [monad],
  ssr: true,
});
