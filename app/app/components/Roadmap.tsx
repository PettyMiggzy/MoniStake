"use client";

type Phase = {
  num: string;
  title: string;
  date: string;
  items: string[];
  goal?: string;
  status: "done" | "live" | "next" | "later";
};

const PHASES: Phase[] = [
  {
    num: "01",
    title: "Launch & Foundations",
    date: "Q4 2025",
    status: "done",
    items: [
      "Fair launch of $MONI on Nad.fun",
      "Total supply: 1,000,000,000 $MONI",
      "Website live with real-time buying guide",
      "Active Telegram community",
      "Supply lock after the bonding curve completes",
      "Regular burns to progressively reduce circulating supply",
    ],
    goal: "1,000 holders + strong organic buzz",
  },
  {
    num: "02",
    title: "CTO Transition — Community Growth",
    date: "Q1–Q2 2026 · LIVE",
    status: "live",
    items: [
      "Community pickup after the dev went quiet",
      "Site rebuilt from scratch — chogi.xyz infra, no WP, faster",
      "All 16 community art pieces secured + re-hosted",
      "Universal swap on this domain — every trade funds the flywheel",
      "1% Monorail App ID fee → MONI buyback wallet",
      "Telegram + X handed to community stewardship",
    ],
    goal: "Restore momentum · listings on DexScreener + Dextools",
  },
  {
    num: "03",
    title: "Utilities & Expansion",
    date: "Q3 2026",
    status: "next",
    items: [
      "Yeti Squad NFT drop — wear the chain, get the perks",
      '"Submit a Drip" gallery reopens — community art continues',
      "Periodic Buy Contests + meme contests with on-chain payout",
      "Merch (hoodies, stickers)",
      "Influencer onboarding + AMAs",
      "Possible play-to-earn Yeti mini-game",
    ],
    goal: "$10M market cap + strong strategic partnerships",
  },
  {
    num: "04",
    title: "Domination & Sustainability",
    date: "Q4 2026+",
    status: "later",
    items: [
      "Major listings on top-tier CEXs",
      "DAO governance — holders vote on treasury moves",
      "DeFi integrations + AR / metaverse Yeti experiences",
      "Charity initiatives (nature & snow wildlife protection)",
      "Massive global marketing campaigns",
    ],
    goal: "10,000+ holders · Top 1,000 on CMC · fully autonomous community",
  },
  {
    num: "05",
    title: "The Family Portrait",
    date: "Ongoing CTO addition",
    status: "later",
    items: [
      "MONI on the canonical House of Monad page — full pantheon",
      "Cross-Monanimal collabs — Yeti + Moyaki + Chog feature art",
      "Shared swap, shared chart, shared trust across the ecosystem",
      "Yeti claims his lane in the family: the drip",
    ],
    goal: "MONI the elder · part of the Monad cultural fabric",
  },
];

function badge(status: Phase["status"]) {
  if (status === "done")
    return (
      <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-green-300">
        DONE
      </span>
    );
  if (status === "live")
    return (
      <span className="rounded-md bg-purple-500/30 px-2 py-0.5 text-[10px] font-bold tracking-widest text-purple-100 ring-1 ring-purple-400/50 ring-offset-1 ring-offset-[#07050d]">
        LIVE
      </span>
    );
  if (status === "next")
    return (
      <span className="rounded-md bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-yellow-300">
        NEXT
      </span>
    );
  return (
    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/55">
      LATER
    </span>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="mb-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="text-purple-300">05 ·</span> Roadmap
        </h2>
        <p className="mt-1 text-xs text-white/55">
          Picking up exactly where the original team stopped. Phases 1, 2 done /
          live · 3, 4, 5 ahead.
        </p>
      </div>

      <ol className="relative space-y-3">
        {/* Timeline rail */}
        <div
          aria-hidden
          className="absolute left-[14px] top-2 bottom-2 w-px bg-gradient-to-b from-green-400/40 via-purple-400/30 to-white/10"
        />

        {PHASES.map((p) => (
          <li key={p.num} className="relative pl-10">
            <div
              className={`absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${
                p.status === "done"
                  ? "border-green-400/60 bg-green-500/20 text-green-300"
                  : p.status === "live"
                  ? "border-purple-300 bg-purple-500/40 text-white shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                  : "border-white/15 bg-white/5 text-white/60"
              }`}
            >
              {p.num}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                {badge(p.status)}
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-purple-200/60">
                  {p.date}
                </span>
              </div>
              <ul className="space-y-1.5 text-sm text-white/75">
                {p.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-purple-300">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {p.goal ? (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-yellow-200/85">
                  🎯 {p.goal}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-[11px] italic text-white/55">
        Original team gave us the trail. We continue the climb.
        <br />
        <span className="text-white/75">
          "No empty promises. No false summits."
        </span>
      </div>
    </section>
  );
}
