"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits, maxUint256 } from "viem";
import { erc20Abi, wmonAbi, WMON_ADDRESS } from "@/lib/abi";
import {
  KNOWN_TOKENS,
  NATIVE_ZERO,
  explainRevert,
  monorailQuote,
  type MonoQuote,
  type MonoToken,
} from "@/lib/monorail";
import TokenPicker, { TokenIcon } from "./TokenPicker";

const EXPLORER = "https://monadexplorer.com/tx/";

function fmt(n: number | string | bigint | undefined | null, decimals = 18): string {
  if (n == null) return "—";
  const v =
    typeof n === "bigint"
      ? Number(formatUnits(n, decimals))
      : typeof n === "string"
      ? Number(n)
      : n;
  if (isNaN(v)) return "—";
  if (v === 0) return "0";
  if (v < 0.0001) return v.toExponential(2);
  if (v < 1) return v.toFixed(6);
  if (v < 1000) return v.toFixed(4);
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const SLIPPAGES = [
  { label: "0.5%", bps: 50 },
  { label: "1%", bps: 100 },
  { label: "3%", bps: 300 },
  { label: "5%", bps: 500 },
  { label: "10%", bps: 1000 },
  { label: "20%", bps: 2000 },
];

// Quote variant: either Monorail-direct or via-wrap (manual MON→WMON first)
type QuoteVariant =
  | { kind: "direct"; quote: MonoQuote }
  | { kind: "viaWrap"; quote: MonoQuote }; // quote is already WMON→target

export default function SwapWidget({
  defaultFrom,
  defaultTo,
}: {
  defaultFrom?: MonoToken;
  defaultTo?: MonoToken;
}) {
  const { address, isConnected } = useAccount();
  // wagmi v2: both hooks return both sync and async invokers
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const [from, setFrom] = useState<MonoToken>(defaultFrom ?? KNOWN_TOKENS[0]);
  const [to, setTo] = useState<MonoToken>(defaultTo ?? KNOWN_TOKENS[1]);
  const [amountIn, setAmountIn] = useState("");
  const [slipBps, setSlipBps] = useState(500);
  const [variant, setVariant] = useState<QuoteVariant | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState<string | null>(null);
  const [picking, setPicking] = useState<"in" | "out" | null>(null);
  const [status, setStatus] = useState<{
    kind: "info" | "success" | "error";
    msg: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | null>(null);

  const quote = variant?.quote ?? null;
  const isViaWrap = variant?.kind === "viaWrap";

  // Live balances
  const isFromNative = from.address === NATIVE_ZERO;
  const isToNative = to.address === NATIVE_ZERO;
  const { data: nativeBal } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: erc20BalIn } = useReadContract({
    address: from.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !isFromNative },
  });
  const { data: erc20BalOut } = useReadContract({
    address: to.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !isToNative },
  });

  const balIn = isFromNative
    ? nativeBal?.value ?? 0n
    : (erc20BalIn as bigint | undefined) ?? 0n;
  const balOut = isToNative
    ? nativeBal?.value ?? 0n
    : (erc20BalOut as bigint | undefined) ?? 0n;

  // Allowance — for ERC20→x swaps OR the via-wrap path (WMON→target)
  const allowanceCheckToken: `0x${string}` | undefined = isViaWrap
    ? WMON_ADDRESS
    : isFromNative
    ? undefined
    : (from.address as `0x${string}`);
  const router = quote?.transaction.to as `0x${string}` | undefined;
  const { data: allowance } = useReadContract({
    address: allowanceCheckToken,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && router ? [address, router] : undefined,
    query: { enabled: !!address && !!router && !!allowanceCheckToken },
  });

  // Quote requests — debounced + race-safe
  useEffect(() => {
    setVariant(null);
    setQuoteErr(null);
    const amt = parseFloat(amountIn);
    if (!amt || amt <= 0) return;
    if (from.address.toLowerCase() === to.address.toLowerCase()) {
      setQuoteErr("From and To are the same token.");
      return;
    }
    let cancelled = false;
    setQuoting(true);
    const handle = setTimeout(async () => {
      try {
        // First try the direct quote (native or ERC20 as Monorail picks)
        const direct = await monorailQuote({
          from: from.address,
          to: to.address,
          amount: amountIn,
          sender: address ?? "0x000000000000000000000000000000000000dEaD",
          slippageBps: slipBps,
        });
        if (cancelled) return;

        const directHops = direct.routes?.[0]?.length ?? 1;

        // If we're sending native MON AND Monorail picked a 3+ hop route
        // (likely going through a stablecoin), try the same swap with WMON
        // as input. That usually returns a clean 1-hop direct pool route.
        // We'll wrap MON→WMON ourselves in a pre-step.
        if (isFromNative && directHops >= 3) {
          try {
            const viaWrap = await monorailQuote({
              from: WMON_ADDRESS,
              to: to.address,
              amount: amountIn,
              sender: address ?? "0x000000000000000000000000000000000000dEaD",
              slippageBps: slipBps,
            });
            if (cancelled) return;
            const wrapHops = viaWrap.routes?.[0]?.length ?? 1;
            // Use viaWrap only if it actually has fewer hops
            if (wrapHops < directHops) {
              setVariant({ kind: "viaWrap", quote: viaWrap });
              setQuoteErr(null);
              return;
            }
          } catch {
            // Fall through to direct quote
          }
        }

        setVariant({ kind: "direct", quote: direct });
        setQuoteErr(null);
      } catch (e) {
        if (cancelled) return;
        setVariant(null);
        setQuoteErr(explainRevert(e));
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [amountIn, from.address, to.address, slipBps, address, isFromNative]);

  // Receipt watcher
  const { isLoading: waitingReceipt, isSuccess: receiptSuccess } =
    useWaitForTransactionReceipt({
      hash: lastTxHash ?? undefined,
      query: { enabled: !!lastTxHash },
    });
  useEffect(() => {
    if (receiptSuccess && lastTxHash) {
      setStatus({
        kind: "success",
        msg: `Swap confirmed.`,
      });
      setBusy(false);
    }
  }, [receiptSuccess, lastTxHash]);

  function pickToken(side: "in" | "out", t: MonoToken) {
    if (side === "in") {
      if (t.address.toLowerCase() === to.address.toLowerCase()) setTo(from);
      setFrom(t);
    } else {
      if (t.address.toLowerCase() === from.address.toLowerCase()) setFrom(to);
      setTo(t);
    }
    setAmountIn("");
    setPicking(null);
  }

  function flip() {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setAmountIn("");
  }

  async function doSwap() {
    setStatus(null);
    setLastTxHash(null);
    if (!isConnected || !address) {
      setStatus({ kind: "error", msg: "Connect a wallet first." });
      return;
    }
    if (!quote || !quote.transaction) return;
    const amt = parseFloat(amountIn);
    if (!amt || amt <= 0) {
      setStatus({ kind: "error", msg: "Enter an amount." });
      return;
    }
    if (busy) return;
    setBusy(true);

    try {
      const amountWei = parseUnits(amountIn, from.decimals);

      // ─── PATH A: native MON, but going via WMON wrap to avoid bad routes ───
      if (isViaWrap) {
        // Step 1: deposit MON into WMON
        setStatus({
          kind: "info",
          msg: "Step 1 of 3 · Wrapping MON to WMON…",
        });
        const wrapHash = await writeContractAsync({
          address: WMON_ADDRESS,
          abi: wmonAbi,
          functionName: "deposit",
          value: amountWei,
        });
        setStatus({
          kind: "info",
          msg: "Step 1 confirmed. Step 2 of 3 · Approving WMON…",
        });

        // Step 2: approve WMON to the Monorail router (if not already)
        const currentAllow = (allowance as bigint | undefined) ?? 0n;
        if (currentAllow < amountWei) {
          await writeContractAsync({
            address: WMON_ADDRESS,
            abi: erc20Abi,
            functionName: "approve",
            args: [quote.transaction.to, maxUint256],
          });
        }

        // Step 3: execute the WMON→target swap (Monorail tx)
        setStatus({
          kind: "info",
          msg: "Step 3 of 3 · Signing the swap…",
        });
        const gasFromQuote = quote.gas_estimate
          ? BigInt(Math.floor(quote.gas_estimate * 1.2))
          : 800_000n;
        const swapHash = await sendTransactionAsync({
          to: quote.transaction.to,
          data: quote.transaction.data,
          value: 0n,
          gas: gasFromQuote,
        });
        setLastTxHash(swapHash);
        setStatus({
          kind: "info",
          msg: "Swap submitted. Waiting for confirmation…",
        });
        // busy will clear when receipt arrives
        return;
      }

      // ─── PATH B: standard ERC20→x via Monorail ───
      if (!isFromNative) {
        // FIX: was `(allowance ?? 0n) < need` originally written with bad
        // operator precedence — has bitten swaps. Compute the comparison
        // value explicitly.
        const need = BigInt(quote.input);
        const have = (allowance as bigint | undefined) ?? 0n;
        if (have < need) {
          setStatus({
            kind: "info",
            msg: `Approving ${from.symbol}…`,
          });
          await writeContractAsync({
            address: from.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [quote.transaction.to, maxUint256],
          });
        }
      }

      // ─── Path C (default): native MON or post-approve ERC20 swap ───
      setStatus({ kind: "info", msg: "Sign the swap…" });
      const gasFromQuote = quote.gas_estimate
        ? BigInt(Math.floor(quote.gas_estimate * 1.2))
        : 1_500_000n;
      const hash = await sendTransactionAsync({
        to: quote.transaction.to,
        data: quote.transaction.data,
        value: isFromNative ? BigInt(quote.transaction.value) : 0n,
        gas: gasFromQuote,
      });
      setLastTxHash(hash);
      setStatus({
        kind: "info",
        msg: "Submitted. Waiting for confirmation…",
      });
    } catch (e) {
      setStatus({ kind: "error", msg: explainRevert(e) });
      setBusy(false);
    }
  }

  function setMax() {
    if (!isFromNative) {
      setAmountIn(formatUnits(balIn, from.decimals));
    } else {
      const v = Number(formatUnits(balIn, from.decimals));
      const safe = Math.max(0, v - 0.02);
      setAmountIn(safe > 0 ? String(safe) : "");
    }
  }

  const routeLabel = useMemo(() => {
    const proto =
      quote?.routes?.[0]?.[0]?.splits?.[0]?.protocol ?? "aggregator";
    return isViaWrap
      ? `MON wrap → WMON → ${to.symbol} via ${proto}`
      : `${from.symbol} → ${to.symbol} via ${proto}`;
  }, [quote, from.symbol, to.symbol, isViaWrap]);

  const hopCount =
    (quote?.routes?.[0]?.length ?? 1) + (isViaWrap ? 1 : 0); // wrap is +1 step

  const impact = parseFloat(
    quote?.compound_impact ??
      quote?.routes?.[0]?.[0]?.splits?.[0]?.price_impact ??
      "0"
  );

  const isWorking = busy || quoting || waitingReceipt;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-[0_12px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-white">Swap</div>
          <div className="text-xs text-purple-200/70">
            Any Monad token ↔ any Monad token
          </div>
        </div>
        {!isConnected && (
          <div className="scale-90 origin-right">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        )}
      </div>

      {/* FROM */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/55">
          <span>You pay</span>
          <button
            type="button"
            onClick={setMax}
            disabled={!isConnected}
            className="text-purple-300 hover:text-white disabled:opacity-40"
          >
            balance: {fmt(balIn, from.decimals)} {from.symbol}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.0"
            inputMode="decimal"
            className="min-w-0 flex-1 bg-transparent text-2xl font-bold text-white placeholder:text-white/25 outline-none"
          />
          <button
            type="button"
            onClick={() => setPicking("in")}
            className="flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-sm font-bold text-white hover:border-purple-400/60 hover:bg-purple-500/20"
          >
            <TokenIcon tok={from} size={24} />
            <span className="tracking-wider">{from.symbol}</span>
            <span className="text-[10px] text-purple-300/70">▼</span>
          </button>
        </div>
      </div>

      {/* Flip */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={flip}
          aria-label="Flip"
          className="-my-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#07050d] bg-purple-500/30 text-lg text-white hover:rotate-180 transition-transform"
        >
          ⇅
        </button>
      </div>

      {/* TO */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/55">
          <span>You receive (est.)</span>
          <span>
            balance: {fmt(balOut, to.decimals)} {to.symbol}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={quote?.output_formatted ?? ""}
            placeholder={quoting ? "fetching route…" : "0.0"}
            className="min-w-0 flex-1 bg-transparent text-2xl font-bold text-white placeholder:text-white/25 outline-none"
          />
          <button
            type="button"
            onClick={() => setPicking("out")}
            className="flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-sm font-bold text-white hover:border-purple-400/60 hover:bg-purple-500/20"
          >
            <TokenIcon tok={to} size={24} />
            <span className="tracking-wider">{to.symbol}</span>
            <span className="text-[10px] text-purple-300/70">▼</span>
          </button>
        </div>
      </div>

      {/* Slippage */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] uppercase tracking-widest text-white/55">
          Slippage
        </span>
        {SLIPPAGES.map((s) => (
          <button
            key={s.bps}
            type="button"
            onClick={() => setSlipBps(s.bps)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition ${
              slipBps === s.bps
                ? "border-purple-400 bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "border-purple-400/25 bg-purple-500/5 text-white/80 hover:border-purple-400/50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Route details */}
      {quote && (
        <div className="mt-3 rounded-xl border border-purple-400/15 bg-black/30 p-3 text-[11px] text-white/65">
          <div className="flex justify-between py-0.5">
            <span>route</span>
            <span className="font-mono text-white">{routeLabel}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>steps</span>
            <span
              className={`font-mono ${
                hopCount >= 3 ? "text-yellow-300" : "text-white"
              }`}
            >
              {hopCount}
              {hopCount >= 3 ? " ⚠" : ""}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>min received</span>
            <span className="font-mono text-white">
              {fmt(quote.min_output_formatted)} {to.symbol}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>price impact</span>
            <span
              className={`font-mono ${
                impact >= 5 ? "text-pink-400" : "text-yellow-300"
              }`}
            >
              {impact ? `${impact.toFixed(2)}%` : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Via-wrap notice — explain the 3-tx flow before the user signs */}
      {isViaWrap && (
        <div className="mt-2 rounded-xl border border-purple-400/30 bg-purple-500/10 p-3 text-[11px] text-purple-100">
          ℹ Routing via WMON gets a cleaner direct pool path. This will be{" "}
          <b>3 wallet signatures</b>: wrap, approve, swap.
        </div>
      )}

      {/* High impact warning */}
      {quote && impact >= 5 && (
        <div className="mt-2 rounded-xl border border-pink-400/40 bg-pink-500/10 p-3 text-[11px] text-pink-100">
          ⚠ HIGH PRICE IMPACT ({impact.toFixed(1)}%). MONI has thin liquidity
          right now — try a smaller amount.
        </div>
      )}

      {/* Error from quote */}
      {quoteErr && !quote && (
        <div className="mt-3 rounded-xl border border-pink-400/30 bg-pink-500/10 p-3 text-xs text-pink-100">
          {quoteErr}
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={doSwap}
        disabled={!isConnected || !quote || isWorking}
        className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!isConnected
          ? "Connect Wallet"
          : isWorking
          ? "Working…"
          : !amountIn
          ? "Enter amount"
          : quoting
          ? "Routing…"
          : !quote
          ? "No route"
          : isViaWrap
          ? `Wrap + Swap → ${to.symbol}`
          : isFromNative
          ? `Swap ${from.symbol} → ${to.symbol}`
          : `Approve + Swap ${from.symbol} → ${to.symbol}`}
      </button>

      {/* Status */}
      {status && (
        <div
          className={`mt-3 rounded-xl border p-3 text-xs ${
            status.kind === "success"
              ? "border-green-400/40 bg-green-500/10 text-green-100"
              : status.kind === "error"
              ? "border-pink-400/40 bg-pink-500/10 text-pink-100"
              : "border-purple-400/30 bg-purple-500/10 text-purple-100"
          }`}
        >
          {status.msg}{" "}
          {lastTxHash && (
            <a
              href={`${EXPLORER}${lastTxHash}`}
              target="_blank"
              rel="noopener"
              className="underline"
            >
              View tx ↗
            </a>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-[10px] text-white/40">
        Powered by Monorail · 1% routes to the MONI flywheel
      </p>

      <TokenPicker
        open={picking !== null}
        onClose={() => setPicking(null)}
        onPick={(t) => picking && pickToken(picking, t)}
        title={picking === "in" ? "Swap from" : "Swap to"}
      />
    </div>
  );
}
