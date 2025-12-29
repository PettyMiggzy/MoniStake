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
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

function numStr(n: number, max = 4) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: max });
}

function fmtUnits(v: bigint, d: number, max = 4) {
  const n = Number(formatUnits(v, d));
  return numStr(n, max);
}

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stroke bg-panel shadow-soft backdrop-blur p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-ink">{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-stroke bg-white/5 p-4 shadow-tile">
      <div className="text-[11px] uppercase tracking-wide text-sub">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink">{value}</div>
      {sub ? <div className="mt-1 text-xs text-faint">{sub}</div> : null}
    </div>
  );
}

function Meter({
  title,
  leftLabel,
  rightLabel,
  left,
  right,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  left: number;
  right: number;
}) {
  const total = Math.max(left + right, 1e-9);
  const pct = Math.min(100, Math.max(0, (left / total) * 100));

  return (
    <div className="rounded-2xl border border-stroke bg-black/25 p-4">
      <div className="flex items-center justify-between text-xs text-sub">
        <span>{title}</span>
        <span>{leftLabel} / {rightLabel}</span>
      </div>

      <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-faint">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
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

  const buybackWallet = (data?.[10] as unknown as `0x${string}`) ?? BUYBACK;

  const pending = (data?.[11] as unknown as bigint) ?? 0n;
  const user = (data?.[12] as unknown as { amount: bigint; unlockTime: bigint; lockDays: number }) ?? {
    amount: 0n,
    unlockTime: 0n,
    lockDays: 0,
  };

  const yourStaked = user.amount ?? 0n;
  const unlockTimeMs = Number(user.unlockTime ?? 0n) * 1000;
  const isEarly = yourStaked > 0n && Date.now() < unlockTimeMs;

  const stakeBn = useMemo(() => { try { return parseUnits(stakeAmt || "0", decimals); } catch { return 0n; } }, [stakeAmt, decimals]);
  const unstakeBn = useMemo(() => { try { return parseUnits(unstakeAmt || "0", decimals); } catch { return 0n; } }, [unstakeAmt, decimals]);
  const donateBn = useMemo(() => { try { return parseUnits(donateAmt || "0", decimals); } catch { return 0n; } }, [donateAmt, decimals]);

  const needsApprove = stakeBn > 0n && allowance < stakeBn;

  const totalStakedNum = Number(formatUnits(totalStaked, decimals));
  const poolNum = Number(formatUnits(rewardsPool, decimals));
  const yourStakedNum = Number(formatUnits(yourStaked, decimals));
  const yourSharePct = totalStakedNum > 0 ? (yourStakedNum / totalStakedNum) * 100 : 0;

  const input =
    "w-full rounded-xl border border-stroke bg-black/25 px-3 py-2 text-ink placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500/40";

  const btnPrimary =
    "w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2 font-semibold text-white shadow-btn hover:brightness-110 active:brightness-95 disabled:opacity-50";

  const btnGhost =
    "w-full rounded-xl border border-stroke bg-white/5 px-4 py-2 text-white/90 hover:bg-white/10 active:bg-white/15 disabled:opacity-50";

  return (
    <main className="min-h-screen bg-bg text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.85),transparent_60%)]" />
      <Header />

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* HERO */}
        <div className="rounded-3xl border border-stroke bg-panel shadow-glow backdrop-blur p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-ink">MoniStake</div>
              <div className="mt-2 text-sm text-sub max-w-2xl">
                Transparent rewards: the pool is the pool. No fake APR. Early unstake fee routes <b>5%</b> to rewards pool and <b>10%</b> to buyback.
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-faint">
                <span className="rounded-full border border-stroke bg-white/5 px-3 py-1">Contract: <span className="font-mono">{short(STAKING)}</span></span>
                <span className="rounded-full border border-stroke bg-white/5 px-3 py-1">Buyback: <span className="font-mono">{short(buybackWallet)}</span></span>
                <span className="rounded-full border border-stroke bg-white/5 px-3 py-1">Token: <span className="font-mono">{short(MONI)}</span></span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl overflow-hidden border border-stroke bg-white/5 shadow-[0_0_40px_rgba(168,85,247,0.22)]">
                          </div>
              <div className="text-xs text-sub">
                Fees<br />
                <span className="text-ink font-semibold">{(normalFeeBps / 100).toFixed(2)}%</span> unstake → pool<br />
                <span className="text-ink font-semibold">{(earlyPoolBps / 100).toFixed(2)}%</span> pool +{" "}
                <span className="text-ink font-semibold">{(earlyBuyBps / 100).toFixed(2)}%</span> buyback
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Tile label="Total Staked" value={`${fmtUnits(totalStaked, decimals)} ${symbol}`} sub="All stakers" />
            <Tile label="Rewards Pool" value={`${fmtUnits(rewardsPool, decimals)} ${symbol}`} sub="Available rewards" />
            <Tile label="Your Pending" value={`${fmtUnits(pending, decimals)} ${symbol}`} sub={isConnected ? "Claimable now" : "Connect wallet"} />
            <Tile label="Your Share" value={`${numStr(yourSharePct, 2)}%`} sub={isConnected ? "Of total staked" : "—"} />
          </div>

          {/* Meters */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Meter
              title="Pool vs Staked"
              left={poolNum}
              right={totalStakedNum}
              leftLabel={`Pool ${numStr(poolNum, 2)}`}
              rightLabel={`Staked ${numStr(totalStakedNum, 2)}`}
            />
            <Meter
              title="You vs Everyone"
              left={yourStakedNum}
              right={Math.max(totalStakedNum - yourStakedNum, 0)}
              leftLabel={`You ${numStr(yourStakedNum, 4)}`}
              rightLabel={`Others ${numStr(Math.max(totalStakedNum - yourStakedNum, 0), 4)}`}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl border border-stroke bg-white/5 px-4 py-2 text-sm hover:bg-white/10" onClick={() => refetch()}>
              Refresh
            </button>
            <button
              className="rounded-xl border border-stroke bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
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
        </div>

        {/* ACTIONS */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Panel title="Your Lock" right={<span className="text-[11px] text-faint">{isConnected ? (isEarly ? "Early penalty active" : "No early penalty") : ""}</span>}>
            {!isConnected ? (
              <div className="text-sm text-sub">Connect wallet to view your lock status.</div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl border border-stroke bg-black/25 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-sub">Staked</span>
                    <span className="text-ink font-semibold">{fmtUnits(yourStaked, decimals)} {symbol}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-sub">Unlock</span>
                    <span className="text-ink font-semibold">{unlockTimeMs ? new Date(unlockTimeMs).toLocaleString() : "—"}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-sub">Lock Days</span>
                    <span className="text-ink font-semibold">{user.lockDays || 0}</span>
                  </div>

                  {isEarly ? (
                    <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-100/90">
                      ⚠️ Early unstake adds {(earlyPoolBps/100).toFixed(2)}% to pool + {(earlyBuyBps/100).toFixed(2)}% to buyback
                      {" "}plus {(normalFeeBps/100).toFixed(2)}% normal fee.
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100/90">
                      ✅ Normal unstake only.
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Actions">
            <div className="grid grid-cols-4 gap-2">
              {[30, 90, 180, 365].map((d) => (
                <button
                  key={d}
                  className={cn(
                    "rounded-xl border border-stroke px-2 py-2 text-sm",
                    lockDays === d
                      ? "bg-purple-600/25 text-ink shadow-[0_0_0_1px_rgba(168,85,247,0.30)]"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  )}
                  onClick={() => setLockDays(d as any)}
                >
                  {d}d
                </button>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-xs text-sub mb-2">Stake</div>
              <input className={input} value={stakeAmt} onChange={(e) => setStakeAmt(e.target.value)} placeholder={`Amount (${symbol})`} />
              {needsApprove ? (
                <button
                  className={btnPrimary + " mt-3"}
                  disabled={!isConnected || isPending}
                  onClick={() => writeContract({ address: MONI, abi: erc20Abi, functionName: "approve", args: [STAKING, maxUint256] })}
                >
                  Approve
                </button>
              ) : (
                <button
                  className={btnPrimary + " mt-3"}
                  disabled={!isConnected || isPending || stakeBn === 0n}
                  onClick={() => writeContract({ address: STAKING, abi: stakingAbi, functionName: "stake", args: [stakeBn, lockDays] })}
                >
                  Stake
                </button>
              )}
            </div>

            <div className="mt-5">
              <div className="text-xs text-sub mb-2">Unstake</div>
              <input className={input} value={unstakeAmt} onChange={(e) => setUnstakeAmt(e.target.value)} placeholder={`Amount (${symbol})`} />
              <button
                className={btnGhost + " mt-3"}
                disabled={!isConnected || isPending || unstakeBn === 0n}
                onClick={() => writeContract({ address: STAKING, abi: stakingAbi, functionName: "unstake", args: [unstakeBn] })}
              >
                Unstake
              </button>
            </div>

            <div className="mt-6">
              <div className="text-xs text-sub mb-2">Donate to Rewards Pool</div>
              <input className={input} value={donateAmt} onChange={(e) => setDonateAmt(e.target.value)} placeholder={`Amount (${symbol})`} />
              <button
                className={btnPrimary + " mt-3"}
                disabled={!isConnected || isPending || donateBn === 0n}
                onClick={() => writeContract({ address: STAKING, abi: stakingAbi, functionName: "addRewards", args: [donateBn] })}
              >
                Donate
              </button>
              <div className="mt-3 text-[11px] text-faint">
                Anyone can add rewards. If tokens are sent directly to the contract, press <b>Sync Rewards</b>.
              </div>
            </div>
          </Panel>
        </div>

        <div className="mt-8 text-center text-[11px] text-faint">
          Built by Monshi • Contract <span className="font-mono">{STAKING}</span>
        </div>
      </div>
    </main>
  );
}
