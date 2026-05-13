"use client";

const FAQS = [
  {
    q: "What is MONI?",
    a: (
      <>
        MONI is the <strong>purple yeti of Monad</strong> — a community-takeover
        (CTO) memecoin on Monad mainnet. Total supply 1B, renounced contract,
        liquidity on capricorn-v3. The contract address is{" "}
        <code className="rounded bg-purple-900/40 px-1.5 py-0.5 text-[11px] text-yellow-200">
          0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777
        </code>
        .
      </>
    ),
  },
  {
    q: "How do I buy MONI on Monad?",
    a: (
      <>
        Use the <a href="/swap" className="text-yellow-300 underline">universal swap on this site</a>{" "}
        — it auto-wraps your MON into WMON for the clean 1-hop route on the
        capricorn-v3 MONI/WMON pool. You can also buy on{" "}
        <a
          href="https://nad.fun"
          rel="noopener"
          target="_blank"
          className="text-yellow-300 underline"
        >
          nad.fun
        </a>{" "}
        or directly on capricorn.fun.
      </>
    ),
  },
  {
    q: "What chain is MONI on?",
    a: (
      <>
        MONI is on <strong>Monad mainnet</strong> (chain ID 143). Bridge in at{" "}
        <a
          href="https://bridge.monad.xyz"
          rel="noopener"
          target="_blank"
          className="text-yellow-300 underline"
        >
          bridge.monad.xyz
        </a>{" "}
        and you'll need MON for gas.
      </>
    ),
  },
  {
    q: "What is the Monitain tier system?",
    a: (
      <>
        Five tiers: 🦐 Shrimp (0–100K), 🥾 Sherpa (100K–500K), ⛏️ Climber
        (500K–1M), 💎 Diamond (1M–5M), 👑 Emperor (5M+). Each unlocks perks:
        gallery priority, art bounties, OG mint list, DAO whitelist. See the{" "}
        <a href="/about" className="text-yellow-300 underline">
          full tier breakdown
        </a>
        .
      </>
    ),
  },
  {
    q: "Who are the Monanimals?",
    a: (
      <>
        The canonical five — <strong>Molandak</strong>, <strong>Chog</strong>,{" "}
        <strong>Moyaki</strong>, <strong>Mouch</strong>, <strong>Salmonad</strong>.
        Born from Monad community memes. MONI is joining them as the yeti. See{" "}
        <a href="/pantheon" className="text-yellow-300 underline">
          the Pantheon
        </a>
        .
      </>
    ),
  },
  {
    q: "Is MONI a rug?",
    a: (
      <>
        No. MONI is a community takeover — the original deployer renounced
        ownership, the contract has no mint function, and operations are run
        by self-organized community contributors. We ship publicly. Full
        details on the{" "}
        <a href="/about" className="text-yellow-300 underline">
          About page
        </a>
        .
      </>
    ),
  },
  {
    q: "How do I contact the MONI team?",
    a: (
      <>
        Email{" "}
        <a
          href="mailto:admin@monimonad.com"
          className="text-yellow-300 underline"
        >
          admin@monimonad.com
        </a>{" "}
        for partnerships, listings, or press. For community questions, join
        the{" "}
        <a
          href="https://t.me/MoniTheYeti"
          rel="noopener"
          target="_blank"
          className="text-yellow-300 underline"
        >
          Telegram
        </a>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto mb-12 max-w-3xl px-5 md:mb-16">
      <header className="mb-6 text-center">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-yellow-300">
          Frequently Asked
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Questions about MONI
        </h2>
      </header>
      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40"
          >
            <summary className="cursor-pointer list-none text-base font-bold text-white md:text-lg">
              <span className="mr-2 text-yellow-300">▸</span>
              {item.q}
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-white/80">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
