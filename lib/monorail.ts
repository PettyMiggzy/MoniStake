// Monorail aggregator client — universal Monad swap routing.
// One API call returns a ready-to-broadcast transaction. Routes across
// every major Monad DEX (Kuru, Crystal, Clober, Capricorn, Octoswap,
// Atlantis, IziSwap, LFJ, Uniswap V3, ...). Splits a single swap across
// venues when that nets more output.
//
// 1% of every quote routes to the chogi/MONI flywheel via App ID.

export const MONORAIL = {
  QUOTE: "https://pathfinder.monorail.xyz/v4/quote",
  TOKENS: "https://api.monorail.xyz/v2/tokens",
  TOKEN: "https://api.monorail.xyz/v2/token",
  APP_ID: "1176408161625", // King's registered App ID — 1% fee → treasury
} as const;

export const NATIVE_ZERO = "0x0000000000000000000000000000000000000000" as const;

export type MonoToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  image_uri?: string | null;
  mon_per_token?: string;
  usd_per_token?: string;
  holders?: number;
};

export type MonoRouteSplit = {
  protocol: string;
  fee?: string;
  percentage?: string;
  price_impact?: string;
};

export type MonoRouteHop = {
  from_symbol?: string;
  to_symbol?: string;
  splits: MonoRouteSplit[];
};

export type MonoQuote = {
  input: string;
  input_formatted: string;
  output: string;
  output_formatted: string;
  min_output: string;
  min_output_formatted: string;
  compound_impact?: string;
  gas_estimate?: number;
  routes?: MonoRouteHop[][];
  transaction: {
    to: `0x${string}`;
    data: `0x${string}`;
    value: `0x${string}`;
  };
  message?: string;
};

export async function monorailQuote(args: {
  from: string;
  to: string;
  amount: string; // human-readable, e.g. "1.5"
  sender: string;
  slippageBps?: number;
  deadlineSec?: number;
  maxHops?: number;
}): Promise<MonoQuote> {
  const params = new URLSearchParams({
    from: args.from || NATIVE_ZERO,
    to: args.to,
    amount: String(args.amount),
    sender: args.sender,
    slippage: String(args.slippageBps ?? 300),
    source: MONORAIL.APP_ID,
    // Cap hops at 2 by default. Multi-hop routes through random
    // intermediary tokens are how aggregators rug low-liq pairs
    // like MONI — compounding slippage across hops makes a 1 MON
    // swap quote ~5000 MONI optimistically and deliver ~3500,
    // tripping the slippage check. 2 hops = MON wrap + direct pool.
    max_hops: String(args.maxHops ?? 2),
  });
  if (args.deadlineSec) params.set("deadline", String(args.deadlineSec));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  let j: MonoQuote;
  try {
    const r = await fetch(`${MONORAIL.QUOTE}?${params.toString()}`, {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(`Monorail HTTP ${r.status}`);
    j = (await r.json()) as MonoQuote;
  } catch (e: any) {
    if (e?.name === "AbortError")
      throw new Error("Monorail quote timed out — slow network");
    throw new Error(`Monorail unreachable: ${e?.message ?? "network error"}`);
  } finally {
    clearTimeout(timer);
  }
  if (j.message && !j.transaction) throw new Error(j.message);
  return j;
}

export async function searchTokens(query: string): Promise<MonoToken[]> {
  if (!query) return [];
  const url = `${MONORAIL.TOKENS}?find=${encodeURIComponent(query)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j) ? (j as MonoToken[]) : [];
  } catch {
    return [];
  }
}

export async function tokenMeta(addr: string): Promise<MonoToken | null> {
  try {
    const r = await fetch(`${MONORAIL.TOKEN}/${addr.toLowerCase()}`);
    if (!r.ok) return null;
    return (await r.json()) as MonoToken;
  } catch {
    return null;
  }
}

// Translate raw revert reasons into something humans can read.
export function explainRevert(err: unknown): string {
  const m =
    (err as Error)?.message ||
    (err as { shortMessage?: string })?.shortMessage ||
    String(err);
  const low = m.toLowerCase();
  if (low.includes("no valid routes"))
    return "No swap route found. Token may have zero liquidity.";
  if (low.includes("swap amount is required")) return "Enter an amount.";
  if (low.includes("insufficient balance") || low.includes("insufficient funds"))
    return "Not enough balance to cover this trade + gas.";
  if (
    low.includes("insufficient_output_amount") ||
    low.includes("amount_out_min") ||
    low.includes("slippage")
  )
    return "Slippage too tight — price moved between quote and execution. Try 10% slippage on thin-liquidity tokens.";
  if (low.includes("expired") || low.includes("deadline"))
    return "Tx deadline passed. Retry.";
  if (low.includes("user denied") || low.includes("user rejected"))
    return "Wallet signature cancelled.";
  if (low.includes("aggregate") && low.includes("reverted"))
    return "Aggregator route reverted on-chain — likely thin liquidity in one of the hops. Bump slippage to 10% and retry.";
  if (low.includes("execution reverted") && !low.includes("reason"))
    return "Trade simulation failed. The route likely passes through a low-liquidity pool. Try bumping slippage to 10%, or a smaller amount.";
  return m || "Unknown error";
}

// Ecosystem token list — curated for the picker. Search the Monorail
// catalog for anything not in here.
export const KNOWN_TOKENS: MonoToken[] = [
  {
    address: NATIVE_ZERO,
    symbol: "MON",
    name: "Monad",
    decimals: 18,
    image_uri:
      "https://monorail-static.fra1.digitaloceanspaces.com/tokens/mon-token.svg",
  },
  {
    address: "0x0cc9b2e2acd7bacff79eb7db48f5662b622e7777",
    symbol: "MONI",
    name: "MONI · the Yeti",
    decimals: 18,
    image_uri:
      "https://storage.nadapp.net/coin/ccecbcf5-278e-48ef-a5db-63d2abd58ca0",
  },
  {
    address: "0xb744f5cdb792d8187640214c4a1c9ace29af7777",
    symbol: "MONSHI",
    name: "Monshi",
    decimals: 18,
    image_uri:
      "https://storage.nadapp.net/coin/bdf23c46-ccd6-447d-b3ed-d84a911aae7a",
  },
  {
    address: "0xaca86430cccedbedb35910fc8a5afef07da37777",
    symbol: "RENE",
    name: "Rene",
    decimals: 18,
    image_uri:
      "https://storage.nadapp.net/coin/515a9ad5-e127-4e97-92af-5f8206fa9478",
  },
  {
    address: "0xde22b2d5b92364fec7065c638ad82509949f7777",
    symbol: "MOYAKI",
    name: "Moyaki — the Moyaking",
    decimals: 18,
    image_uri:
      "https://storage.nadapp.net/coin/a12e769e-bd61-491e-8e28-6b4acf3ba2da",
  },
  {
    address: "0x5e1b1a14c8758104b8560514e94ab8320e587777",
    symbol: "CHOGI",
    name: "Chogi",
    decimals: 18,
    image_uri: null, // local-only — chogi.xyz hosts it
  },
  {
    address: "0x3bd359c1119da7da1d913d1c4d2b7c461115433a",
    symbol: "WMON",
    name: "Wrapped MON",
    decimals: 18,
    image_uri:
      "https://monorail-static.fra1.digitaloceanspaces.com/tokens/wmon.svg",
  },
];

export const SHORTCUT_SYMBOLS = ["MON", "MONI", "MOYAKI", "MONSHI", "RENE"];
