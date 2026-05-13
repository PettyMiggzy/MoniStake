import type { Metadata } from "next";
import Header from "@/components/Header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monistake.vercel.app";

export const metadata: Metadata = {
  title: "About MONI — The Yeti of Monad · Community Takeover Memecoin",
  description:
    "Learn about MONI — the purple yeti memecoin on Monad mainnet. Community-takeover (CTO) project, no team allocation, fair-launched on nad.fun, graduated to capricorn-v3. The full story, the contract, the roadmap, and how to join the climb.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About MONI · The Yeti of Monad",
    description:
      "The community-takeover yeti memecoin on Monad. The full story, the contract, the roadmap.",
    url: `${siteUrl}/about`,
    images: ["/Moni.png"],
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl + "/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: siteUrl + "/about",
    },
  ],
};

const aboutPageLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About MONI",
  url: `${siteUrl}/about`,
  description:
    "The story of MONI — the community-takeover yeti memecoin on Monad mainnet.",
  about: {
    "@type": "Thing",
    name: "MONI",
    description: "Purple yeti memecoin on Monad mainnet, CTO project.",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
      />
      <Header />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-24 text-white">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-xs uppercase tracking-[0.2em] text-white/50"
        >
          <a href="/" className="hover:text-yellow-300">
            Home
          </a>{" "}
          <span aria-hidden>›</span> <span className="text-yellow-300">About</span>
        </nav>

        <header className="mb-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-yellow-300">
            About MONI
          </p>
          <h1 className="mb-3 text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            The Yeti of Monad
          </h1>
          <p className="max-w-2xl text-base text-white/75 md:text-lg">
            MONI is the purple yeti of Monad — a community-takeover (CTO)
            memecoin on Monad mainnet. Fair-launched on nad.fun, graduated to
            the capricorn-v3 DEX, run entirely by community contributors.
            This is the story.
          </p>
        </header>

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-purple-400/30 bg-purple-950/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
              Network
            </p>
            <p className="mt-2 text-lg font-bold">Monad Mainnet</p>
            <p className="text-xs text-white/55">Chain ID 143 · EVM</p>
          </div>
          <div className="rounded-2xl border border-purple-400/30 bg-purple-950/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
              Supply
            </p>
            <p className="mt-2 text-lg font-bold">1,000,000,000 MONI</p>
            <p className="text-xs text-white/55">
              Fixed · Renounced · No mint
            </p>
          </div>
          <div className="rounded-2xl border border-purple-400/30 bg-purple-950/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
              Liquidity
            </p>
            <p className="mt-2 text-lg font-bold">Capricorn V3</p>
            <p className="text-xs text-white/55">MONI / WMON pool</p>
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            What is MONI?
          </h2>
          <p className="text-white/80">
            MONI is the purple yeti mascot of the Monad community. It started
            as community art in the BeBe TG group — a chained-out yeti with
            Pit Vipers, painting the Monitain — and graduated into a fully
            community-run memecoin on Monad mainnet.
          </p>
          <p className="text-white/80">
            The original deployer renounced ownership and stepped back. A
            self-organized group of community members took over operations,
            branding, infrastructure, and shipping. Every piece of this site,
            every commit, every art piece in the gallery — community work.
          </p>
          <p className="text-white/80">
            <strong className="text-yellow-300">No empty promises.</strong>{" "}
            <strong className="text-yellow-300">No false summits.</strong>{" "}
            Real updates, real code, real climb.
          </p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Where MONI lives on Monad
          </h2>
          <p className="text-white/80">
            MONI was fair-launched on <strong>nad.fun</strong>, Monad's
            community launchpad. Once it graduated the bonding curve, liquidity
            migrated to a <strong>capricorn-v3</strong> MONI/WMON concentrated
            liquidity pool. The pool sits on Crust Finance (a Uniswap V3 fork
            running on Monad mainnet).
          </p>
          <p className="text-white/80">
            The cleanest route to buy MONI is the WMON path — wrap your
            native MON into WMON and swap directly. Our universal{" "}
            <a
              href="/swap"
              className="text-yellow-300 underline-offset-4 hover:underline"
            >
              swap page
            </a>{" "}
            handles this automatically: it detects when Monorail picks a
            multi-hop route and auto-wraps your MON so the trade lands on the
            clean 1-hop capricorn-v3 path.
          </p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            The Pantheon — MONI and the Monanimals
          </h2>
          <p className="text-white/80">
            Monad has five canonical mascots called the{" "}
            <a
              href="/pantheon"
              className="text-yellow-300 underline-offset-4 hover:underline"
            >
              Monanimals
            </a>
            : <strong>Molandak</strong> (the hedgehog, first-born),{" "}
            <strong>Chog</strong> (the cat-like painter),{" "}
            <strong>Moyaki</strong> (half cat half salmon),{" "}
            <strong>Mouch</strong> (the cult-favorite fly), and{" "}
            <strong>Salmonad</strong> (the salmoposted fish). Born from
            community memes and the Monadverse lore.
          </p>
          <p className="text-white/80">
            <strong>MONI is joining the pantheon</strong> as the yeti — the
            mountain spirit of Monad. Different vibe, same culture: built by
            the nads, for the nads.
          </p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            The Monitain — five tiers, one mountain
          </h2>
          <p className="text-white/80">
            Every MONI holder has a tier. Each tier unlocks community perks:
            gallery priority, art bounty pool access, OG mint list slots for
            the Yeti Squad NFT, DAO whitelist.
          </p>
          <div className="overflow-hidden rounded-2xl border border-purple-400/30">
            <table className="w-full text-sm">
              <thead className="bg-purple-900/40 text-left text-[10px] uppercase tracking-[0.18em] text-yellow-300">
                <tr>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Range</th>
                  <th className="p-3">Perks</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-t border-white/10">
                  <td className="p-3">🦐 Shrimp</td>
                  <td className="p-3">0 – 100K</td>
                  <td className="p-3">Base camp · the journey starts</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">🥾 Sherpa</td>
                  <td className="p-3">100K – 500K</td>
                  <td className="p-3">Trail unlocked · chain earned</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">⛏️ Climber</td>
                  <td className="p-3">500K – 1M</td>
                  <td className="p-3">
                    Pit Vipers · bounty list · gallery priority
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">💎 Diamond</td>
                  <td className="p-3">1M – 5M</td>
                  <td className="p-3">OG mint list · DAO whitelist</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">👑 Emperor</td>
                  <td className="p-3">5M+</td>
                  <td className="p-3">The throne · direct line to the CTO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            The Forge — burn MONI to mint your art
          </h2>
          <p className="text-white/80">
            The Forge is MONI's first real utility. Upload your community art,
            burn 10,000 MONI to the dead address (
            <code className="rounded bg-purple-900/40 px-1.5 py-0.5 text-[11px] text-yellow-200">
              0x000…dEaD
            </code>
            ), and your piece gets a permanent <strong>FORGED</strong> badge
            in the gallery — plus a locked-in Yeti Squad NFT mint slot for
            when that contract drops.
          </p>
          <p className="text-white/80">
            Every burn is tracked in the on-site Burn Meter, a live counter
            of total MONI removed from supply. The number only goes up.
          </p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Contract details
          </h2>
          <dl className="grid gap-3 rounded-2xl border border-purple-400/30 bg-purple-950/30 p-5 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                Contract Address
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-white/85">
                0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                Liquidity Pair
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-white/85">
                0x0198833561e4B64aFA593cC3E90f446933ac2a9a
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                Decimals
              </dt>
              <dd className="mt-1 text-white/85">18</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                Total Supply
              </dt>
              <dd className="mt-1 text-white/85">1,000,000,000 (1 billion)</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                Ownership
              </dt>
              <dd className="mt-1 text-white/85">
                Renounced · No mint function · Locked liquidity
              </dd>
            </div>
          </dl>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                What is MONI?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                MONI is the purple yeti memecoin on Monad mainnet — a
                community-takeover project run by self-organized contributors
                from the BeBe TG and broader Monad community. Total supply 1B,
                renounced contract, liquid on capricorn-v3.
              </p>
            </details>
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                How do I buy MONI?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                Easiest path is the{" "}
                <a href="/swap" className="text-yellow-300 underline">
                  universal swap on this site
                </a>
                . Connect your wallet (MetaMask, Phantom, Rabby, or
                WalletConnect mobile), pick MON → MONI, sign. The engine
                handles auto-wrap to WMON so you get the clean capricorn-v3
                route. You can also buy on{" "}
                <a
                  href="https://nad.fun"
                  className="text-yellow-300 underline"
                  rel="noopener"
                  target="_blank"
                >
                  nad.fun
                </a>{" "}
                or directly on capricorn-v3.
              </p>
            </details>
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                What is Monad?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                Monad is a high-performance, EVM-compatible Layer 1
                blockchain with parallel execution, 10,000+ TPS, and ~1 second
                block times. MONI is deployed on Monad mainnet (chain ID 143).
                Bridge in at{" "}
                <a
                  href="https://bridge.monad.xyz"
                  className="text-yellow-300 underline"
                  rel="noopener"
                  target="_blank"
                >
                  bridge.monad.xyz
                </a>
                .
              </p>
            </details>
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                Why is the swap auto-wrapping my MON?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                Because MONI's pool is on capricorn-v3 and the Monorail
                aggregator's default route for native MON → MONI is a 3-hop
                path through stablecoins that reverts on-chain. Pre-wrapping
                to WMON forces the clean 1-hop route via the actual MONI/WMON
                pool. Same flow nad.fun and cap use.
              </p>
            </details>
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                Who is the team?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                There is no team in the traditional sense. MONI is a CTO
                (community takeover) — a self-organized group of contributors
                from the Monad community handle dev, art, ops, and partnerships.
                Reach the lead organizer at{" "}
                <a
                  href="mailto:admin@monimonad.com"
                  className="text-yellow-300 underline"
                >
                  admin@monimonad.com
                </a>{" "}
                or in the Telegram.
              </p>
            </details>
            <details className="group rounded-2xl border border-purple-400/25 bg-purple-950/25 p-4 transition open:bg-purple-950/40">
              <summary className="cursor-pointer text-base font-bold text-white">
                Is there an NFT?
              </summary>
              <p className="mt-2 text-sm text-white/75">
                The Yeti Squad NFT is on the roadmap. Holders who hit the
                Diamond and Emperor tiers, plus everyone who forges art
                through the Forge, lock in a mint slot. Snapshot date and
                mint mechanics will be announced through the Telegram and X.
              </p>
            </details>
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-purple-950/60 via-violet-900/40 to-amber-950/30 p-8 text-center md:p-12">
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Ready to climb?
          </h2>
          <p className="mb-6 text-white/75">
            Connect your wallet, find your tier, send it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/swap"
              className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-purple-950 transition hover:scale-105"
            >
              🔁 BUY MONI
            </a>
            <a
              href="/pantheon"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:border-yellow-400"
            >
              ⛰ The Pantheon
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:border-yellow-400"
            >
              📧 Contact
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
