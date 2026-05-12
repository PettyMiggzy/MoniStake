"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/Moni.png"
            alt="MONI the Yeti"
            className="h-10 w-10 rounded-xl border border-purple-400/30 bg-white/5 object-cover ring-1 ring-purple-500/20 group-hover:ring-purple-400/60 transition"
          />
          <div className="leading-tight">
            <div className="text-base font-bold tracking-wide text-white">MONI</div>
            <div className="text-xs text-purple-200/70">The Yeti of Monad</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
          <a
            href="/"
            className="rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-white"
          >
            Home
          </a>
          <a
            href="/swap"
            className="rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-white"
          >
            Swap
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://t.me/MoniTheYeti"
            target="_blank"
            rel="noopener"
            className="hidden sm:inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
            title="Telegram"
          >
            TG
          </a>
          <a
            href="https://x.com/MoniYetiMonad"
            target="_blank"
            rel="noopener"
            className="hidden sm:inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
            title="X / Twitter"
          >
            X
          </a>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="mt-2 flex md:hidden gap-1 text-xs font-semibold uppercase tracking-wider">
        <a
          href="/"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white/80"
        >
          Home
        </a>
        <a
          href="/swap"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white/80"
        >
          Swap
        </a>
      </nav>
    </header>
  );
}
