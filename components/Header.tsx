"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Pantheon", href: "/pantheon" },
  { label: "Submit", href: "/#submit", highlight: true },
  { label: "Swap", href: "/swap" },
  { label: "Contact", href: "/contact" },
  { label: "Monad", href: "https://www.monad.xyz", external: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "bg-[#07050d]/85 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:py-4">
          {/* BRAND */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/Moni.png"
              alt="MONI"
              className="h-11 w-11 rounded-2xl object-cover ring-2 ring-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition group-hover:ring-purple-400/80"
            />
            <div className="leading-tight">
              <div className="text-base md:text-lg font-extrabold tracking-wide bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                MONI
              </div>
              <div className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-purple-200/70">
                The Yeti of Monad
              </div>
            </div>
          </a>

          {/* DESKTOP NAV — like the old site */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em]">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                target={n.external ? "_blank" : undefined}
                rel={n.external ? "noopener" : undefined}
                className={
                  n.highlight
                    ? "rounded-lg border border-purple-400/40 bg-purple-500/20 px-3 py-2 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:bg-purple-500/30"
                    : "relative rounded-lg px-3 py-2 text-white/75 hover:text-white transition group"
                }
              >
                {n.label}
                {!n.highlight ? (
                  <span className="pointer-events-none absolute inset-x-3 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-purple-300 to-transparent transition-transform group-hover:scale-x-100" />
                ) : null}
              </a>
            ))}
          </nav>

          {/* RIGHT: socials + wallet */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <a
              href="https://t.me/MoniTheYeti"
              target="_blank"
              rel="noopener"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white/80 hover:bg-purple-500/15 hover:text-white"
              title="Telegram"
              aria-label="Telegram"
            >
              TG
            </a>
            <a
              href="https://x.com/monadmonicto"
              target="_blank"
              rel="noopener"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white/80 hover:bg-purple-500/15 hover:text-white"
              title="X / Twitter"
              aria-label="X / Twitter"
            >
              𝕏
            </a>
            <div className="hidden sm:block">
              <ConnectButton chainStatus="icon" showBalance={false} />
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 w-5 rounded bg-white transition ${
                    mobileOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded bg-white transition ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded bg-white transition ${
                    mobileOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-lg lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="absolute inset-x-0 top-[72px] mx-3 rounded-3xl border border-purple-400/30 bg-[#0c0719]/95 p-4 shadow-[0_20px_60px_rgba(168,85,247,0.25)]">
            <nav className="grid gap-1 text-sm font-bold uppercase tracking-[0.15em]">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  target={n.external ? "_blank" : undefined}
                  rel={n.external ? "noopener" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-white/85 hover:bg-purple-500/15 hover:text-white"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a
                href="https://t.me/MoniTheYeti"
                target="_blank"
                rel="noopener"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white/85"
              >
                Telegram
              </a>
              <a
                href="https://x.com/monadmonicto"
                target="_blank"
                rel="noopener"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white/85"
              >
                X
              </a>
              <a
                href="https://dexscreener.com/monad/0x0198833561e4b64afa593cc3e90f446933ac2a9a"
                target="_blank"
                rel="noopener"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white/85"
              >
                Chart
              </a>
            </div>
            <div className="mt-3 sm:hidden">
              <ConnectButton chainStatus="icon" showBalance={false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
