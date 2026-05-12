"use client";

type Phase = {
  num: string;
  title: string;
  date: string;
  tagline: string;
  items: string[];
  goal?: string;
  status: "done" | "live" | "next" | "later";
};

const PHASES: Phase[] = [
  {
    num: "00",
    title: "The Original Climb",
    date: "Q4 2025",
    tagline: "Where it started",
    status: "done",
    items: [
      "Fair launch on nad.fun · 1B supply",
      "Bonding curve graduated · LP locked",
      "First 6 community art pieces submitted",
      "563 holders · original mountain summit reached",
      "Then the dev went quiet",
    ],
    goal: "The trail was marked. Now it gets continued.",
  },
  {
    num: "01",
    title: "Community Takeover",
    date: "May 2026 · LIVE NOW",
    tagline: "The Yeti picks himself up",
    status: "live",
    items: [
      "Site rebuilt from scratch — no WordPress, no dev keys",
      "16 original art pieces secured + hosted in this gallery",
      "Universal swap aggregator on monad — every trade routes 1% to the MONI treasury",
      "Monorail App ID 1176408161625 — flywheel is live",
      "BeBe The Great TG group: active artist + degen base",
      "Wallets handed to community stewardship · public addresses",
    ],
    goal: "Re-anchor the brand. Stop the bleed. Make swapping MONI fund MONI.",
  },
  {
    num: "02",
    title: "The Monitain",
    date: "Summer 2026 · NEXT",
    tagline: "Build the home base",
    status: "next",
    items: [
      "Monitain landing zone — single MONI brand HQ at moni.xyz",
      "Yeti Squad NFT collection — minted FROM the community gallery (the artists become the collection)",
      "Diamond Yeti / Emperor MONI tier system — holder tiers unlock perks (priority gallery placement, raid roles, OG list for next mint)",
      "DexScreener + Dextools paid listings",
      "Weekly art bounties — 100K MONI for top community piece each week",
      "Twitter Spaces with Monad ecosystem founders",
    ],
    goal: "5,000 holders · MONI is THE Monad meme nobody can ignore",
  },
  {
    num: "03",
    title: "The Pantheon",
    date: "Q3 2026",
    tagline: "Take a seat at the table",
    status: "next",
    items: [
      "Cross-Monanimal collabs — joint art drops with MOYAKI, CHOG, MONSHI, RENE",
      "MONI gets a tile on the canonical House of Monad family page",
      "Merch line: Pit Viper sunglasses (real ones, branded MONI), gold chains, hoodies",
      "Real-world Monitain meetup — pick a snowy location, gather the community",
      "Influencer onboarding (the ones who actually trade Monad)",
    ],
    goal: "MONI is recognized as Monad culture — not just a coin",
  },
  {
    num: "04",
    title: "The Throne",
    date: "Late 2026 / early 2027",
    tagline: "Lock the future in",
    status: "later",
    items: [
      "DAO governance — Yeti Squad NFT holders vote treasury direction",
      "DeFi integrations beyond the swap — LP rewards, lending markets if liquidity supports it",
      "Strategic CEX listings (only if volume earns them — no paid pumps)",
      "Recurring burns funded by accumulated swap fees",
      "Charity initiative: real-world snow wildlife protection (tying back to the Yeti origin)",
    ],
    goal: "Self-sustaining flywheel · MONI funds MONI forever",
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
      <span className="rounded-md bg-purple-500/40 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white ring-1 ring-purple-300/60">
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
    <section id="roadmap" className="mb-12 md:mb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-300">
            The Path Up
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Roadmap
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Where the original team stopped and where the community is going.
            This is what the CTO is committing to, not a wish list.
          </p>
        </div>
      </div>

      <ol className="relative space-y-4">
        {/* Timeline rail */}
        <div
          aria-hidden
          className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-green-400/40 via-purple-400/30 to-white/5"
        />

        {PHASES.map((p) => (
          <li key={p.num} className="relative pl-12">
            <div
              className={`absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 text-[11px] font-extrabold ${
                p.status === "done"
                  ? "border-green-400/70 bg-green-500/20 text-green-300"
                  : p.status === "live"
                  ? "border-purple-300 bg-purple-500/40 text-white shadow-[0_0_24px_rgba(168,85,247,0.6)]"
                  : "border-white/15 bg-white/5 text-white/60"
              }`}
            >
              {p.num}
            </div>

            <div
              className={`rounded-2xl border bg-black/30 p-5 transition ${
                p.status === "live"
                  ? "border-purple-400/40 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {badge(p.status)}
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-200/60">
                  {p.date}
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white">
                {p.title}
              </h3>
              <div className="mt-0.5 text-xs italic text-white/55">{p.tagline}</div>

              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {p.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {p.goal ? (
                <div className="mt-4 rounded-lg border-l-2 border-purple-400/60 bg-purple-500/5 px-3 py-2 text-[11px] font-medium text-purple-100/85">
                  <span className="font-bold text-purple-300">→ Outcome:</span>{" "}
                  {p.goal}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 p-5 text-center">
        <div className="text-xs italic text-white/65">
          "No empty promises. No false summits."
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-purple-200/60">
          Carried over from the original team. Held by the CTO.
        </div>
      </div>
    </section>
  );
}
