"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Header from "@/components/Header";
import SwapWidget from "@/components/SwapWidget";
import { KNOWN_TOKENS, type MonoToken, NATIVE_ZERO } from "@/lib/monorail";

function resolveParam(raw: string | null): MonoToken | undefined {
  if (!raw) return undefined;
  const s = raw.trim();
  // Address?
  if (/^0x[a-f0-9]{40}$/i.test(s)) {
    const lc = s.toLowerCase();
    const k = KNOWN_TOKENS.find((t) => t.address.toLowerCase() === lc);
    if (k) return k;
    return {
      address: lc,
      symbol: "TOKEN",
      name: "Custom token",
      decimals: 18,
      image_uri: null,
    };
  }
  // Symbol
  const up = s.toUpperCase();
  return KNOWN_TOKENS.find((t) => t.symbol.toUpperCase() === up);
}

function SwapPageInner() {
  const params = useSearchParams();
  const fromTok = useMemo(() => resolveParam(params.get("from")), [params]);
  const toTok = useMemo(() => resolveParam(params.get("to")), [params]);

  // Sensible defaults: MON → MONI on a bare visit
  const defaultFrom =
    fromTok ?? KNOWN_TOKENS.find((t) => t.address === NATIVE_ZERO)!;
  const defaultTo =
    toTok ?? KNOWN_TOKENS.find((t) => t.symbol === "MONI")!;

  // If both ended up identical, fall back so the picker isn't busted
  const safeTo =
    defaultFrom.address.toLowerCase() === defaultTo.address.toLowerCase()
      ? KNOWN_TOKENS.find((t) => t.symbol === "MONI") ?? KNOWN_TOKENS[1]
      : defaultTo;

  return (
    <main className="min-h-screen bg-[#07050d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.95),transparent_60%)]" />

      <Header />

      <div className="mx-auto max-w-md px-5 py-6">
        <div className="mb-4 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-white">
            Buy <span className="text-purple-300">$MONI</span>
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-purple-200/70">
            Then lock the Yeti
          </div>
        </div>

        <SwapWidget defaultFrom={defaultFrom} defaultTo={safeTo} />

        <div className="mt-4 flex flex-col gap-2 text-center text-xs text-white/55">
          <a href="/" className="text-purple-300 hover:text-white">
            ← Back to staking
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SwapPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#07050d] text-white">
          <div className="mx-auto max-w-md px-5 py-12 text-center text-white/60">
            Loading swap…
          </div>
        </main>
      }
    >
      <SwapPageInner />
    </Suspense>
  );
}
