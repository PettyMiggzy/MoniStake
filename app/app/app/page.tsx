"use client";

import Header from "@/components/Header";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { formatUnits, parseUnits, maxUint256 } from "viem";
import { useMemo, useState } from "react";
import { erc20Abi, stakingAbi } from "@/lib/abi";

const MONI = process.env.NEXT_PUBLIC_MONI_TOKEN as `0x${string}`;
const STAKING = process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`;
const BUYBACK = process.env.NEXT_PUBLIC_BUYBACK_WALLET as `0x${string}`;

const cn = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const short = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
const fmt = (v: bigint, d: number) =>
  Number(formatUnits(v ?? 0n, d)).toLocaleString(undefined, { maximumFractionDigits: 6 });

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-[0_12px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      {children}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/50">{sub}</div> : null}
    </div>
  );
}

export default function Page() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [stakeAmt, setStakeAmt] = useState("");
  const [unstakeAmt, setUnstakeAmt] = useState("");
  const [donateAmt, setDonateAmt] = useState("");
  const [lockDays, setLockDays] = useState<30 | 90 | 180 | 365>(30);

  const contracts = useMemo(() => {
    if (!address) return [];
    return [
      { address: MONI, abi: erc20Abi, functionName: "decimals" as const },
      { address: MONI, abi: erc20Abi, functionName: "symbol" as const },
      { address: MONI, abi: erc20Abi, functionName: "balanceOf" as const, args: [address] as const },
      { address: MONI, abi: erc20Abi, functionName: "allowance" as const, args: [address, STAKING] as const },

      { address: STAKING, abi: stakingAbi, functionName: "totalStaked" as const },
      { address: STAKING, abi: stakingAbi, functionName: "rewardsInPool" as const },
      { address: STAKING, abi: stakingAbi, functionName: "stakerCount" as const },

      { address: STAKING, abi: stakingAbi, functionName: "normalUnstakeFeeBps" as const },
      { address: STAKING, abi: stakingAbi, functionName: "earlyPenaltyToPoolBps" as const },
      { address: STAKING, abi: stakingAbi, functionName: "earlyPenaltyToBuybackBps" as const },
      { address: STAKING, abi: stakingAbi, functionName: "buybackWallet" as const },

      { address: STAKING, abi: stakingAbi, functionName: "pendingRewards" as const, args: [address] as const },
      { address: STAKING, abi: stakingAbi, functionName: "userInfo" as const, args: [address] as const },
    ];
  }, [address]);

  const { data, refetch } = useReadContracts({
    allowFailure: false,
    contracts: contracts as any,
    query: { enabled: !!address },
  });

  const decimals = (data?.[0] as unknown as number) ?? 18;
  const symbol = (data?.[1] as unknown as string) ?? "MONI";
  const walletBal = (data?.[2] as unknown as bigint) ?? 0n;
  const allowance = (data?.[3] as unknown as bigint) ?? 0n;

  const totalStaked = (data?.[4] as unknown as bigint) ?? 0n;
  const rewardsPool = (data?.[5] as unknown as bigint) ?? 0n;
  const stakerCount = (data?.[6] as unknown as bigint) ?? 0n;

  const normalFeeBps = (data?.[7] as unknown as number) ?? 200;
  const earlyPoolBps = (data?.[8] as unknown as number) ?? 500;
  const earlyBuyBps = (data?.[9] as unknown as number) ?? 1000;

  const buybackWallet = ((data?.[10] as unknown as `0x${string}`) ?? BUYBACK) as `0x${string}`;

  const pending = (data?.[11] as unknown as bigint) ?? 0n;
  const user = (data?.[12] as unknown as {
    amount: bigint;
    rewardDebt: bigint;
    unlockTime: bigint;
    lockDays: number;
    exists: boolean;
  }) ?? { amount: 0n, rewardDebt: 0n, unlockTime: 0n, lockDays: 0, exists: false };

  const yourStaked = user.amount ?? 0n;
  const unlockTimeMs = Number(user.unlockTime ?? 0n) * 1000;
  const isEarly = yourStaked > 0n && Date.now() < unlockTimeMs;

  const stakeBn = useMemo(() => {
    try {
      return parseUnits(stakeAmt || "0", decimals);
    } catch {
      return 0n;
    }
  }, [stakeAmt, decimals]);

  const unstakeBn = useMemo(() => {
    try {
      return parseUnits(unstakeAmt || "0", decimals);
    } catch {
      return 0n;
    }
  }, [unstakeAmt, decimals]);

  const donateBn = useMemo(() => {
    try {
      return parseUnits(donateAmt || "0", decimals);
    } catch {
      return 0n;
    }
  }, [donateAmt, decimals]);

  const needsApprove = allowance < stakeBn && stakeBn > 0n;

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500/40";

  const btnPrimary =
    "w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2 font-semibold text-white shadow-[0_10px_30px_rgba(168,85,247,0.22)] hover:brightness-110 disabled:opacity-50";

  const btnSecondary =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 hover:bg-white/10 disabled:opacity-50";

  return (
    <main className="min-h-screen bg-[#07050d] text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.95),transparent_60%)]" />

      <Header />

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* TOP CARD */}
        <Card>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-2xl font-bold">Stake {symbol}</div>
              <div className="mt-2 text-sm text-white/70 max-w-2xl">
                Rewards are pool-based (donations + fee flow). No fake APR.
                Early unstake routes <b>5%</b> to rewards pool and <b>10%</b> to buyback.
              </div>

              <div className="mt-3 text-xs text-white/55">
                Staking: <span className="font-mono">{short(STAKING)}</span> • Buyback:{" "}
                <span className="font-mono">{short(buybackWallet)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <img src="/Moni.png" alt="MONI" className="h-10 w-10 rounded-xl object-cover" />
              <div className="text-xs text-white/70 leading-relaxed">
                <div><b>Fees</b></div>
                <div>{(normalFeeBps / 100).toFixed(2)}% unstake → pool</div>
                <div>{(earlyPoolBps / 100).toFixed(2)}% pool + {(earlyBuyBps / 100).toFixed(2)}% buyback</div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Stat label="Total Staked" value={`${fmt(totalStaked, decimals)} ${symbol}`} />
            <Stat label="Rewards Pool" value={`${fmt(rewardsPool, decimals)} ${symbol}`} sub="Pool is distributed on sync" />
            <Stat
              label="Your Pending"
              value={isConnected ? `${fmt(pending, decimals)} ${symbol}` : `Connect wallet`}
              sub={isConnected ? "Live" : "to view rewards"}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" onClick={() => refetch()}>
              Refresh
            </button>

            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
              disabled={!isConnected || isPending}
              onClick={() => writeContract({ address: STAKING, abi: stakingAbi, functionName: "syncRewards" })}
            >
              Sync Rewards
            </button>

            <button
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
              disabled={!isConnected || isPending}
              onClick={() => writeContract({ address: STAKING, abi: stakingAbi, functionName: "claim" })}
            >
              Claim
            </button>
          </div>

          <div className="mt-3 text-[11px] text-white/50">
            Note: small donations may not show immediately due to formatting/scale. Sync distributes rewards.
          </div>
        </Card>

        {/* TWO COLUMN */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* LEFT: YOUR POSITION */}
          <Card>
            <div className="text-sm font-semibold">Your Position</div>

            {!isConnected ? (
              <div className="mt-3 text-sm text-white/70">Connect wallet to see your stake, lock, and pending.</div>
            ) : (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/65">Wallet</span>
                  <span>{fmt(walletBal, decimals)} {symbol}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/65">Your Staked</span>
                  <span>{fmt(yourStaked, decimals)} {symbol}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/65">Stakers</span>
                  <span>{stakerCount.toString()}</span>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
                  <div className="text-xs text-white/60">Lock</div>
                  <div className="mt-1 font-semibold">{user.lockDays || 0} days</div>
                  <div className="mt-1 text-xs text-white/55">
                    Unlock: {unlockTimeMs ? new Date(unlockTimeMs).toLocaleString() : "—"}
                  </div>

                  {isEarly ? (
                    <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-100/90">
                      ⚠️ Early unstake applies: {(earlyPoolBps/100).toFixed(2)}% pool + {(earlyBuyBps/100).toFixed(2)}% buyback (plus {(normalFeeBps/100).toFixed(2)}% normal).
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100/90">
                      ✅ No early penalty right now.
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* RIGHT: ACTIONS */}
          <Card>
            <div className="text-sm font-semibold">Stake / Unstake / Donate</div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[30, 90, 180, 365].map((d) => (
                <button
                  key={d}
                  className={cn(
                    "rounded-xl border border-white/10 px-2 py-2 text-sm",
                    lockDays === d
                      ? "bg-purple-600/25 text-white shadow-[0_0_0_1px_rgba(168,85,247,0.30)]"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  )}
                  onClick={() => setLockDays(d as any)}
                >
                  {d}d
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-xs text-white/60 mb-2">Stake</div>
              <input className={inputClass} value={stakeAmt} onChange={(e) => setStakeAmt(e.target.value)} placeholder={`Amount (${symbol})`} />

              {needsApprove ? (
                <button
                  className={btnPrimary + " mt-3"}
                  disabled={!isConnected || isPending}
                  onClick={() =>
                    writeContract({
                      address: MONI,
                      abi: erc20Abi,
                      functionName: "approve",
                      args: [STAKING, maxUint256],
                    })
                  }
                >
                  Approve {symbol}
                </button>
              ) : (
                <button
                  className={btnPrimary + " mt-3"}
                  disabled={!isConnected || isPending || stakeBn === 0n}
                  onClick={() =>
                    writeContract({
                      address: STAKING,
                      abi: stakingAbi,
                      functionName: "stake",
                      args: [stakeBn, lockDays],
                    })
                  }
                >
                  Stake
                </button>
              )}
            </div>

            <div className="mt-5">
              <div className="text-xs text-white/60 mb-2">Unstake</div>
              <input className={inputClass} value={unstakeAmt} onChange={(e) => setUnstakeAmt(e.target.value)} placeholder={`Amount (${symbol})`} />

              <button
                className={btnSecondary + " mt-3"}
                disabled={!isConnected || isPending || unstakeBn === 0n}
                onClick={() =>
                  writeContract({
                    address: STAKING,
                    abi: stakingAbi,
                    functionName: "unstake",
                    args: [unstakeBn],
                  })
                }
              >
                Unstake
              </button>
            </div>

            <div className="mt-6">
              <div className="text-xs text-white/60 mb-2">Donate to Rewards Pool</div>
              <input className={inputClass} value={donateAmt} onChange={(e) => setDonateAmt(e.target.value)} placeholder={`Amount (${symbol})`} />

              <button
                className={btnPrimary + " mt-3"}
                disabled={!isConnected || isPending || donateBn === 0n}
                onClick={() =>
                  writeContract({
                    address: STAKING,
                    abi: stakingAbi,
                    functionName: "addRewards",
                    args: [donateBn],
                  })
                }
              >
                Donate
              </button>

              <div className="mt-3 text-[11px] text-white/55">
                Anyone can add rewards. If tokens are sent directly to the contract press <b>Sync Rewards</b>.
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 pb-10 text-center text-xs text-white/40">
          Built by <span className="text-white/60 font-semibold">King Petty</span>
        </div>
      </div>
    </main>
  );
}
