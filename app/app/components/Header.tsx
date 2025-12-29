"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {/* Moni.png should be in /public */}
            <img src="/Moni.png" alt="MONI" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">MoniStake</div>
            <div className="text-xs text-white/55">Stake MONI • Pool-based rewards</div>
          </div>
        </div>

        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </div>
  );
}
