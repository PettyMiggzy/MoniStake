# MoniStake · CTO Edition

Pool-based staking dapp for **$MONI** on Monad mainnet. Lock 30 / 90 / 180 / 365 days; early unstake routes a slice to the rewards pool and a slice to the buyback wallet. No fake APR — rewards come from donations + early-unstake fee flow.

> *"Lock the Yeti. Earn the Yeti."*
> *MONI the Yeti — the purple spirit of the Monad community.*
> *The dev left. The Yeti stayed.*

## What's on-chain (verified May 2026)

| | |
|---|---|
| **Token** | `0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777` ($MONI · 1B supply) |
| **Staking contract** | `0xAC6Ea4CcE87E3d0bD057E5a761feE97053fBe702` |
| **Buyback wallet** | `0xa9022262eE7bD0085d6be2d62C9C485b976cF314` |
| Normal unstake fee | 2.00% → rewards pool |
| Early unstake fee | 5% → rewards pool + 10% → buyback wallet |
| Lock periods | 30 / 90 / 180 / 365 days |

## Tech stack

- Next.js 16 (App Router)
- wagmi 2 + viem 2 + RainbowKit 2
- Tailwind CSS
- TypeScript

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

### Option A · Netlify

The repo already has `netlify.toml` + `@netlify/plugin-nextjs`. Steps:

1. New site → import from `PettyMiggzy/MoniStake`
2. **Base directory:** `app/app`
3. **Build command:** `npm run build`
4. **Publish directory:** `.next`
5. Add the 4 env vars (below) under Site settings → Environment variables
6. Deploy

### Option B · Vercel

1. New project → import `PettyMiggzy/MoniStake`
2. **Root directory:** `app/app`
3. Framework preset auto-detects Next.js
4. Add the 4 env vars under Settings → Environment Variables
5. Deploy

### Required environment variables

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=cc1358b5e311a1f844c1d6482633c78d
NEXT_PUBLIC_MONI_TOKEN=0x0CC9B2e2AcD7BACfF79eb7dB48F5662B622E7777
NEXT_PUBLIC_STAKING_CONTRACT=0xAC6Ea4CcE87E3d0bD057E5a761feE97053fBe702
NEXT_PUBLIC_BUYBACK_WALLET=0xa9022262eE7bD0085d6be2d62C9C485b976cF314
```

Optional overrides:

```
NEXT_PUBLIC_RPC_URL=https://rpc.monad.xyz
NEXT_PUBLIC_EXPLORER_URL=https://monadscan.com
NEXT_PUBLIC_CHAIN_ID=143
```

> All NEXT_PUBLIC_* values are exposed to the browser at build time — they're configuration, not secrets.

## After deploy

The reward pool starts empty. Stakers won't earn anything until somebody calls `addRewards(amount)` on the staking contract — the UI has a "Donate to Reward Pool" input that anyone can use.

To bootstrap: send a chunk of MONI from the buyback wallet (or any wallet holding MONI) via `addRewards()`. The contract distributes it pro-rata to current stakers based on stake size + lock-period weight (longer locks get a higher share — see contract for exact formula).

## Contract API (read-only)

| Method | Returns | Use |
|---|---|---|
| `totalStaked()` | uint256 | Global MONI locked |
| `rewardsInPool()` | uint256 | Unclaimed rewards |
| `stakerCount()` | uint256 | Distinct stakers |
| `pendingRewards(user)` | uint256 | Pending for an address |
| `userInfo(user)` | `(amount, rewardDebt, unlockTime, lockDays, exists)` | Full position |
| `normalUnstakeFeeBps()` / `earlyPenaltyToPoolBps()` / `earlyPenaltyToBuybackBps()` | uint16 | Fee schedule (bps) |
| `buybackWallet()` | address | Buyback recipient |

## Contract API (writes)

| Method | Purpose |
|---|---|
| `stake(amount, lockDays)` | Lock MONI for 30/90/180/365 days |
| `unstake(amount)` | Withdraw (with fee if early) |
| `claim()` | Pull pending rewards |
| `syncRewards()` | Manually trigger reward accounting refresh |
| `addRewards(amount)` | Anyone can donate MONI to the pool |

## Brand assets

`app/app/public/Moni.png` — official 1024×1024 PNG logo of MONI the Yeti (rescued from nad.fun's storage during the CTO transition).
