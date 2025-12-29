"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <img
            src="/Moni.png"
            alt="MONI"
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 object-cover"
          />
          <div className="leading-tight">
            <div className="text-base font-semibold text-white">MoniStake</div>
            <div className="text-xs text-white/60">Stake MONI • Pool-based rewards</div>
          </div>
        </div>

        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </header>
  );
}
