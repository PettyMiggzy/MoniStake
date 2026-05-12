"use client";

import { useEffect, useState } from "react";
import {
  type Submission,
  listApprovedSubmissions,
  getMyVotes,
  voteSubmission,
  uploadSubmissionImage,
  insertSubmission,
  SEED_SUBMISSIONS,
  getSupabase,
} from "@/lib/supabase";

function fmtRelative(iso: string): string {
  const t = new Date(iso).getTime();
  const d = (Date.now() - t) / 1000;
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 604800) return `${Math.floor(d / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function Card({
  s,
  myVoted,
  onVote,
}: {
  s: Submission;
  myVoted: boolean;
  onVote: () => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:border-purple-400/40 hover:bg-black/50">
      <div className="aspect-square w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.image_url}
          alt={s.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">{s.title}</div>
            <div className="text-[11px] text-white/55">
              by <span className="text-purple-300">{s.username}</span>
              {!s.is_seed ? (
                <span className="text-white/30"> · {fmtRelative(s.created_at)}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={onVote}
            disabled={myVoted}
            className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition ${
              myVoted
                ? "cursor-default bg-pink-500/20 text-pink-300"
                : "bg-white/5 text-white/75 hover:bg-pink-500/15 hover:text-pink-300"
            }`}
          >
            <span aria-hidden>{myVoted ? "❤️" : "🤍"}</span>
            <span>{s.votes}</span>
          </button>
          <div className="flex items-center gap-1 text-white/45">
            <span aria-hidden>👁️</span>
            <span>{s.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setUsername("");
      setFile(null);
      setErr(null);
      setDone(false);
      setBusy(false);
    }
  }, [open]);

  if (!open) return null;
  const canSubmit = title.trim().length > 0 && username.trim().length > 0 && file && !busy;

  async function handleSubmit() {
    if (!canSubmit || !file) return;
    setBusy(true);
    setErr(null);
    try {
      const up = await uploadSubmissionImage(file);
      if ("error" in up) {
        setErr(up.error);
        setBusy(false);
        return;
      }
      const res = await insertSubmission({
        title: title.trim(),
        username: username.trim(),
        image_url: up.url,
      });
      if ("error" in res) {
        setErr(res.error);
        setBusy(false);
        return;
      }
      setDone(true);
      setBusy(false);
      onSubmitted();
    } catch (e: any) {
      setErr(e?.message || "Unknown error");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pt-16 pb-4 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#120420] p-6 shadow-[0_0_60px_rgba(168,85,247,0.25)]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold tracking-wider text-white">SUBMIT A CREATION</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-white/60 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mb-5 text-xs leading-relaxed text-white/55">
          Your art appears in the gallery after a quick review by the
          community. Honor system: 2 submissions per week.
        </p>

        {done ? (
          <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-100">
            ✅ Submitted. Reviewers will approve and add it to the gallery
            shortly. Bow to the Yeti.
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <label className="mb-3 block">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
                Title <span className="text-white/35">({title.length}/30)</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 30))}
                placeholder="MONI sends it"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                maxLength={30}
              />
              <div className="mt-1 text-[10px] text-white/35">
                Links are not allowed in the title
              </div>
            </label>

            <label className="mb-3 block">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
                Username <span className="text-white/35">({username.length}/20)</span>
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                placeholder="your handle"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                maxLength={20}
              />
            </label>

            <label className="mb-4 block">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
                Image
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/75 file:mr-3 file:rounded-lg file:border file:border-purple-400/30 file:bg-purple-500/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-purple-500/20"
              />
              <div className="mt-1 text-[10px] text-white/35">
                PNG / JPG / GIF / WebP · max 20 MB
              </div>
            </label>

            {err ? (
              <div className="mb-3 rounded-xl border border-pink-400/30 bg-pink-500/10 p-3 text-xs text-pink-100">
                {err}
              </div>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/75 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-[2] rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(168,85,247,0.3)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Uploading…" : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [myVotes, setMyVotes] = useState<Record<string, true>>({});
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    setMyVotes(getMyVotes());
    listApprovedSubmissions().then(setItems);
  }, []);

  async function handleVote(id: string) {
    if (myVotes[id]) return;
    // Optimistic
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
    );
    setMyVotes((v) => ({ ...v, [id]: true }));
    const res = await voteSubmission(id);
    if ("error" in res) {
      // Rollback if it actually failed
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: Math.max(0, s.votes - 1) } : s))
      );
      setMyVotes((v) => {
        const c = { ...v };
        delete c[id];
        return c;
      });
    }
  }

  async function refreshAfterSubmit() {
    listApprovedSubmissions().then(setItems);
  }

  const supabaseReady = getSupabase() !== null;

  return (
    <section id="gallery" className="mb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-purple-300">06 ·</span> The Gallery
          </h2>
          <p className="mt-1 text-xs text-white/55">
            Community-submitted MONI art. Bow to the Yeti.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(168,85,247,0.3)] hover:brightness-110"
        >
          📤 Submit a Creation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((s) => (
          <Card
            key={s.id}
            s={s}
            myVoted={!!myVotes[s.id]}
            onVote={() => handleVote(s.id)}
          />
        ))}
      </div>

      {!supabaseReady ? (
        <div className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-500/5 p-3 text-[11px] text-yellow-200/80">
          🛠 New submissions need Supabase configured. Run{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">supabase/schema.sql</code>{" "}
          in your Supabase project, then add{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_URL</code>
          {" + "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to your Vercel env vars. The seed gallery above works without it.
        </div>
      ) : null}

      <SubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitted={refreshAfterSubmit}
      />
    </section>
  );
}
