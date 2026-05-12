# MONI · The Yeti of Monad

CTO-run site for **$MONI** on Monad mainnet — purple yeti, Pit Vipers, gold chains. Homepage + universal swap aggregator. No staking (the original contract is unaudited; deleted from this build).

> *"Purple. Pit Vipers. Paint. Pump."*
> *MONI the Yeti — the purple spirit of the Monad community.*
> *The dev left. The Yeti stayed.*

## What this app is

- **`/`** — landing page with live stats (price · 24h · holders · liquidity from Monorail + DexScreener), DexScreener chart embed, lore, and a big Buy $MONI CTA
- **`/swap`** — universal Monad swap aggregator (any token ↔ any token). Defaults to MON → MONI. Routed through Monorail's pathfinder v4 with App ID `1176408161625` so 1% of every swap flows to the MONI flywheel treasury

## On-chain references

| | |
|---|---|
| **MONI token** | `0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777` (1B supply) |
| **DexScreener pair** | `0x0198833561e4B64aFA593cC3E90f446933ac2a9a` (nad-fun) |

## Tech stack

- Next.js 16 (App Router) + Turbopack
- wagmi 2 + viem 2 + RainbowKit 2
- Tailwind CSS + TypeScript
- Monorail aggregator API (free, CORS-open)
- DexScreener API (free, CORS-open)

## Local dev

```bash
git clone https://github.com/PettyMiggzy/MoniStake.git
cd MoniStake/app/app
cp ../.env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy

### Vercel (recommended)

The repo has a `vercel.json` at the root that tells Vercel where the
Next.js project lives, so **you don't need to set Root Directory**.

1. **New Project** → import `PettyMiggzy/MoniStake`
2. Leave **Root Directory** as the default (`.` / repo root)
3. Framework will auto-detect via vercel.json
4. (Optional) Add env vars under **Settings → Environment Variables**
   — the build will succeed without any env vars set thanks to the
   baked-in defaults, but setting `NEXT_PUBLIC_SITE_URL` to your
   real domain makes OG/Twitter previews look right.
5. **Deploy**

**Troubleshooting 404 on every route:**
- This usually means the build failed. Open the Vercel deployment
  → Build Logs. If you see TypeError about `projectId`, the
  WalletConnect env var isn't being picked up. Fixed in this build
  via a fallback default — just trigger a fresh deploy.
- If "Build Output → Functions" is empty in the Vercel UI, the
  vercel.json `buildCommand` didn't run from the right cwd. Verify
  the file exists at the repo root and re-deploy.

### Netlify

`netlify.toml` is already in the repo. Set up:

1. New site → import from `PettyMiggzy/MoniStake`
2. **Base directory:** `app/app`
3. **Build command:** `npm run build`
4. **Publish directory:** `.next`
5. Add env vars under Site settings → Environment variables
6. Deploy

### Required environment variables

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=89d7a1882c0fa9a5bbe0a58accafc100
NEXT_PUBLIC_MONI_TOKEN=0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777
```

Optional (recommended for production):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.xyz
NEXT_PUBLIC_RPC_URL=https://rpc.monad.xyz
NEXT_PUBLIC_EXPLORER_URL=https://monadscan.com
NEXT_PUBLIC_CHAIN_ID=143
```

> `NEXT_PUBLIC_SITE_URL` resolves OG/Twitter image URLs to absolute paths so social previews work. Defaults to `https://monistake.netlify.app` if unset.
>
> All `NEXT_PUBLIC_*` values are exposed to the browser — they're configuration, not secrets.

## Fee routing

Every swap quote passes `source=1176408161625` (the registered Monorail App ID). Monorail's pathfinder reserves 1% of the input amount and routes it to the configured treasury wallet:

```
0x4601a7f665ca13c40d2236b8b9ff1e4b87226351
```

A buyback bot processes that wallet on a 10-minute cadence — converts non-CHOGI fees to MON revenue, burns CHOGI to dead.

## Brand assets

- `app/app/public/Moni.png` — 1024×1024 canonical mascot (purple yeti in Pit Vipers + MONI chain)
- Original art rescued from `monitheyeti.com` during CTO transition (16 community pieces total — kept offline for now)

## Lore

The Yeti came down from a neighboring mountain to climb Monad. Drawn by performance. He brought the chains, brought the brush, brought the bit. The community grew around "send it." Six early artists made him their canvas. Then the dev went quiet.

**The mountain stayed. The Yeti stayed. The chains definitely stayed.**

The CTO continues from there.

> "No empty promises. No false summits." — original team, preserved.
