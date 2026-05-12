"use client";

import { useEffect, useState } from "react";
import {
  KNOWN_TOKENS,
  NATIVE_ZERO,
  SHORTCUT_SYMBOLS,
  searchTokens,
  tokenMeta,
  type MonoToken,
} from "@/lib/monorail";

function shortAddr(a: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

function TokenIcon({ tok, size = 34 }: { tok: MonoToken; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (!tok.image_uri || broken) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-black font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {(tok.symbol || "?").slice(0, 1)}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tok.image_uri}
      alt={tok.symbol}
      onError={() => setBroken(true)}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-black"
    />
  );
}

export default function TokenPicker({
  open,
  onClose,
  onPick,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (t: MonoToken) => void;
  title: string;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<MonoToken[]>(KNOWN_TOKENS);
  const [resultsLabel, setResultsLabel] = useState("ECOSYSTEM");

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults(KNOWN_TOKENS);
      setResultsLabel("ECOSYSTEM");
    }
  }, [open]);

  useEffect(() => {
    if (!q) {
      setResults(KNOWN_TOKENS);
      setResultsLabel("ECOSYSTEM");
      return;
    }
    // Pasted contract address — resolve via on-chain meta
    if (/^0x[a-f0-9]{40}$/i.test(q.trim())) {
      const addr = q.trim().toLowerCase();
      const inKnown = KNOWN_TOKENS.find((k) => k.address.toLowerCase() === addr);
      if (inKnown) {
        setResults([inKnown]);
        setResultsLabel("MATCH");
        return;
      }
      setResultsLabel("RESOLVING…");
      tokenMeta(addr).then((m) => {
        if (m) {
          setResults([m]);
          setResultsLabel("RESOLVED FROM CHAIN");
        } else {
          setResults([]);
          setResultsLabel("NOT FOUND");
        }
      });
      return;
    }
    // Symbol/name search — debounce slightly
    setResultsLabel("SEARCHING…");
    const handle = setTimeout(async () => {
      const list = await searchTokens(q);
      const filtered = (list || [])
        .slice(0, 30)
        .map(
          (t): MonoToken => ({
            address: (t.address || "").toLowerCase(),
            symbol: t.symbol || "?",
            name: t.name || "",
            decimals: t.decimals || 18,
            image_uri: t.image_uri || null,
          })
        )
        .filter((t) => /^0x[a-f0-9]{40}$/i.test(t.address));
      setResults(filtered);
      setResultsLabel(filtered.length ? "MONORAIL RESULTS" : "NO MATCHES");

      // Progressive enrichment: backfill image_uris for results that
      // came back without a logo (Monorail's search omits them ~half the time)
      const need = filtered.filter((t) => !t.image_uri);
      if (need.length) {
        const enriched = await Promise.allSettled(
          need.map((t) => tokenMeta(t.address))
        );
        const updates: Record<string, string | undefined> = {};
        enriched.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value?.image_uri) {
            updates[need[i].address] = r.value.image_uri;
          }
        });
        setResults((prev) =>
          prev.map((t) =>
            updates[t.address] ? { ...t, image_uri: updates[t.address] } : t
          )
        );
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pt-16 pb-4 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#120420] p-5 shadow-[0_0_60px_rgba(168,85,247,0.25)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold tracking-wider text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-white/60 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search symbol · name · paste contract address"
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        />

        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/45">
          Common
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {SHORTCUT_SYMBOLS.map((sym) => {
            const tok = KNOWN_TOKENS.find((k) => k.symbol === sym);
            if (!tok) return null;
            return (
              <button
                key={sym}
                type="button"
                onClick={() => onPick(tok)}
                className="flex items-center gap-1.5 rounded-lg border border-purple-400/25 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:border-purple-400/60 hover:bg-purple-500/20"
              >
                <TokenIcon tok={tok} size={18} />
                {tok.symbol}
              </button>
            );
          })}
        </div>

        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/45">
          {resultsLabel}
        </div>
        <div className="max-h-[340px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-white/50">
              No tokens match. Try pasting a contract address.
            </div>
          ) : (
            results.map((t) => (
              <button
                key={t.address}
                type="button"
                onClick={() => onPick(t)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-purple-500/10"
              >
                <TokenIcon tok={t} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">
                    {t.symbol}
                  </div>
                  {t.name ? (
                    <div className="truncate text-[11px] text-white/55">
                      {t.name}
                    </div>
                  ) : null}
                  {t.address !== NATIVE_ZERO ? (
                    <div className="font-mono text-[10px] text-purple-300/60">
                      {shortAddr(t.address)}
                    </div>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export { TokenIcon };
