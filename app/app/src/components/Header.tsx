"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stroke bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-stroke bg-panel shadow-[0_0_24px_rgba(168,85,247,0.25)]">
            <Image src="/Moni.png" alt="MONI" fill className="object-cover" priority />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-white">MoniStake</div>
              <span className="rounded-full border border-stroke bg-white/5 px-2 py-0.5 text-[11px] text-white/80">
                MONAD
              </span>
            </div>
            <div className="text-[11px] text-white/55">
              Pool-based rewards • transparent fees • mobile wallets
            </div>
          </div>
        </div>

        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}
