"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Roadmap from "@/components/Roadmap";
import Gallery from "@/components/Gallery";

const MONI_ADDR = "0x0cc9b2e2acd7bacff79eb7db48f5662b622e7777";
const DEXSCREENER_PAIR = "0x0198833561e4b64afa593cc3e90f446933ac2a9a";

type Stats = {
  priceUsd?: number;
  h24?: number;
  holders?: number;
  liquidity?: number;
};

function fmtUsd(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  if (n === 0) return "$0";
  if (n < 0.000001) return "$" + n.toExponential(2);
  if (n < 0.01) return "$" + n.toFixed(6);
  if (n < 1) return "$" + n.toFixed(4);
  if (n < 1000) return "$" + n.toFixed(2);
  if (n < 1e6) return "$" + (n / 1000).toFixed(1) + "k";
  if (n < 1e9) return "$" + (n / 1e6).toFixed(2) + "M";
  return "$" + (n / 1e9).toFixed(2) + "B";
}

function fmtInt(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

function fmtPct(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-white/55">{label}</div>
      <div className={`mt-1 text-lg font-bold ${color ?? "text-white"}`}>{value}</div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    let cancel = false;

    async function refresh() {
      // Monorail: price + holders
      fetch(`https://api.monorail.xyz/v2/token/${MONI_ADDR}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (cancel || !j) return;
          setStats((s) => ({
            ...s,
            priceUsd: j.usd_per_token ? Number(j.usd_per_token) : s.priceUsd,
            holders: typeof j.holders === "number" ? j.holders : s.holders,
          }));
        })
        .catch(() => {});

      // DexScreener: 24h change + liquidity (Monorail doesn't surface these)
      fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${MONI_ADDR}`,
        { cache: "no-store" }
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (cancel || !j?.pairs?.length) return;
          const pair = [...j.pairs].sort(
            (a: any, b: any) =>
              (parseFloat(b?.liquidity?.usd) || 0) -
              (parseFloat(a?.liquidity?.usd) || 0)
          )[0];
          const h24 = parseFloat(pair?.priceChange?.h24);
          const liq = parseFloat(pair?.liquidity?.usd);
          setStats((s) => ({
            ...s,
            h24: isNaN(h24) ? s.h24 : h24,
            liquidity: isNaN(liq) ? s.liquidity : liq,
          }));
        })
        .catch(() => {});
    }

    refresh();
    const t = setInterval(refresh, 30000);
    return () => {
      cancel = true;
      clearInterval(t);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#07050d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.95),transparent_60%)]" />

      <Header />

      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* CTO BANNER */}
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/15 to-fuchsia-500/15 px-4 py-2.5 text-xs">
          <span className="rounded-md bg-purple-500/30 px-2 py-0.5 font-bold tracking-wider text-purple-100">
            CTO
          </span>
          <span className="text-white/80">
            community-run · dev left · the Yeti stayed
          </span>
        </div>

        {/* HERO */}
        <section className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:text-left">
          <img
            src="/Moni.png"
            alt="MONI the Yeti"
            className="h-40 w-40 rounded-3xl object-cover ring-4 ring-purple-400/30 shadow-[0_0_60px_rgba(168,85,247,0.5)] md:h-48 md:w-48"
          />
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-yellow-200 bg-clip-text text-transparent">
                MONI
              </span>{" "}
              <span className="text-white">the Yeti</span>
            </h1>
            <div className="mt-2 text-sm uppercase tracking-[0.25em] text-purple-200/80">
              Purple. Pit Vipers. Paint. Pump.
            </div>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              The purple spirit of the Monad community. Born on a neighboring
              mountain, climbing this one — chain on his neck, brush in his
              hand. The dev left. The Yeti stayed.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/swap"
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(168,85,247,0.35)] hover:brightness-110"
              >
                Buy $MONI →
              </a>
              <a
                href={`https://dexscreener.com/monad/${DEXSCREENER_PAIR}`}
                target="_blank"
                rel="noopener"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10"
              >
                Chart ↗
              </a>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Price" value={fmtUsd(stats.priceUsd)} />
          <Stat
            label="24h"
            value={fmtPct(stats.h24)}
            color={
              stats.h24 == null
                ? undefined
                : stats.h24 >= 0
                ? "text-green-400"
                : "text-pink-400"
            }
          />
          <Stat label="Holders" value={fmtInt(stats.holders)} />
          <Stat label="Liquidity" value={fmtUsd(stats.liquidity)} />
        </section>

        {/* CHART */}
        <section className="mb-10">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-purple-300">LIVE ·</span> The Chart
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-white/45">
              via DexScreener
            </span>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl border border-purple-400/25 bg-black/60 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="aspect-[16/9] min-h-[420px] sm:min-h-[480px]">
              <iframe
                src={`https://dexscreener.com/monad/${DEXSCREENER_PAIR}?embed=1&theme=dark&trades=0&info=0`}
                title="MONI live chart on Monad"
                loading="lazy"
                allow="clipboard-write"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </section>

        {/* LORE */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-300">
              The Lore
            </div>
            <h3 className="mt-1 text-2xl font-bold">The Yeti with the Pit Vipers</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              A purple yeti. Spiked horns. Rainbow Pit Vipers. Gold grills. A
              gold chain with a MONI pendant. Paint-splattered overalls. He
              came from a mountain — he looks like he came from a yacht.
              <br />
              <br />
              That contradiction is the whole point.
              <br />
              <br />
              Drawn by Monad's performance, he left his original summit to
              climb this one. The community grew around the bit. <i>Send
              it.</i> Six early supporters submitted art to the gallery. Then
              the dev went quiet. The mountain stayed. The Yeti stayed. The
              chains <b>definitely</b> stayed.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-300">
              The CTO
            </div>
            <h3 className="mt-1 text-2xl font-bold">Pick up the brush</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              The original creator gave us the mascot, the creed, and the
              roadmap. We continue from where they stopped.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li className="flex gap-2">
                <span className="text-purple-300">→</span> 1% of every swap
                routes to the MONI flywheel
              </li>
              <li className="flex gap-2">
                <span className="text-purple-300">→</span> Community-owned
                socials, no dev keys
              </li>
              <li className="flex gap-2">
                <span className="text-purple-300">→</span> All 16 community
                art pieces preserved
              </li>
              <li className="flex gap-2">
                <span className="text-purple-300">→</span> MONI joins the
                Monanimal pantheon — the drip
              </li>
            </ul>
            <div className="mt-5 text-xs italic text-white/55">
              "No empty promises. No false summits." — original team,
              preserved.
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <Roadmap />

        {/* GALLERY */}
        <Gallery />

        {/* SOCIAL FOOTER */}
        <section className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs">
          <a
            href="https://t.me/MoniTheYeti"
            target="_blank"
            rel="noopener"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white/80 hover:bg-white/10"
          >
            Telegram
          </a>
          <a
            href="https://x.com/MoniYetiMonad"
            target="_blank"
            rel="noopener"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white/80 hover:bg-white/10"
          >
            X / Twitter
          </a>
          <a
            href={`https://monadexplorer.com/token/${MONI_ADDR}`}
            target="_blank"
            rel="noopener"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white/80 hover:bg-white/10"
          >
            Contract ↗
          </a>
        </section>

        <div className="mb-2 text-center text-[10px] text-white/35">
          monad mainnet · <span className="font-mono">{MONI_ADDR}</span>
        </div>
      </div>
    </main>
  );
}
