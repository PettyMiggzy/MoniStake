// Supabase client for the MONI gallery submission feature.
//
// Storage: a public bucket called 'moni-submissions' holds uploaded images.
// DB:      moni_submissions    — rows for each submission (status pending/approved/rejected)
//          moni_submission_votes — heart taps, deduped per (submission_id, voter_id)
//
// Both are optional — if SUPABASE env vars aren't set, the gallery falls
// back to a built-in seed list (the 3 rescued community pieces from the
// original monitheyeti.com gallery) and the Submit button shows an error
// asking the operator to configure Supabase.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const SUPABASE_BUCKET = "moni-submissions";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

export type Submission = {
  id: string;
  title: string;
  username: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  views: number;
  created_at: string;
  is_seed?: boolean;
};

// Hard-coded seed — these are community pieces from monitheyeti.com
// and the BeBe The Great Telegram, rescued + curated during the CTO
// transition. They always appear in the gallery alongside any new
// Supabase submissions.
export const SEED_SUBMISSIONS: Submission[] = [
  { id: "seed-04", title: "The Monitain", username: "BeBeTheGreat", image_url: "/gallery/04-the-monitain.jpg", status: "approved", votes: 47, views: 921, created_at: "2026-05-10T00:00:00Z", is_seed: true },
  { id: "seed-06", title: "Emperor MONI", username: "BeBeTheGreat", image_url: "/gallery/06-emperor-moni.jpg", status: "approved", votes: 38, views: 712, created_at: "2026-05-09T00:00:00Z", is_seed: true },
  { id: "seed-05", title: "Diamond Time", username: "BeBeTheGreat", image_url: "/gallery/05-diamond-time.jpg", status: "approved", votes: 33, views: 624, created_at: "2026-05-08T00:00:00Z", is_seed: true },
  { id: "seed-10", title: "Iced Out King", username: "BeBeTheGreat", image_url: "/gallery/10-glitter-portrait.jpg", status: "approved", votes: 31, views: 588, created_at: "2026-05-07T00:00:00Z", is_seed: true },
  { id: "seed-07", title: "Sending It (Monad Board)", username: "BeBeTheGreat", image_url: "/gallery/07-snowboard-monad.jpg", status: "approved", votes: 29, views: 567, created_at: "2026-05-07T00:00:00Z", is_seed: true },
  { id: "seed-11", title: "Building the Monitain", username: "BeBeTheGreat", image_url: "/gallery/11-builder-bricks.jpg", status: "approved", votes: 26, views: 502, created_at: "2026-05-06T00:00:00Z", is_seed: true },
  { id: "seed-08", title: "Chef's Special", username: "BeBeTheGreat", image_url: "/gallery/08-chef-money.jpg", status: "approved", votes: 24, views: 476, created_at: "2026-05-06T00:00:00Z", is_seed: true },
  { id: "seed-09", title: "Summit Push", username: "BeBeTheGreat", image_url: "/gallery/09-climb-pickaxe.jpg", status: "approved", votes: 22, views: 451, created_at: "2026-05-06T00:00:00Z", is_seed: true },
  { id: "seed-12", title: "Snow Shadow", username: "BeBeTheGreat", image_url: "/gallery/12-snow-shadow.jpg", status: "approved", votes: 19, views: 412, created_at: "2026-05-05T00:00:00Z", is_seed: true },
  { id: "seed-13", title: "Frozen Conveyor", username: "BeBeTheGreat", image_url: "/gallery/13-conveyor-popsicles.jpg", status: "approved", votes: 17, views: 389, created_at: "2026-05-05T00:00:00Z", is_seed: true },
  { id: "seed-14", title: "Snow Sketch", username: "BeBeTheGreat", image_url: "/gallery/14-snow-carved.jpg", status: "approved", votes: 15, views: 358, created_at: "2026-05-05T00:00:00Z", is_seed: true },
  { id: "seed-02", title: "MONI THE YETI", username: "MONI", image_url: "/gallery/02-moni-the-yeti.webp", status: "approved", votes: 21, views: 588, created_at: "2025-12-28T00:00:00Z", is_seed: true },
  { id: "seed-01", title: "First crea", username: "Moni", image_url: "/gallery/01-first-crea.jpg", status: "approved", votes: 21, views: 593, created_at: "2025-12-28T00:00:00Z", is_seed: true },
  { id: "seed-03", title: "Moni Art", username: "AKUN", image_url: "/gallery/03-moni-art.webp", status: "approved", votes: 14, views: 478, created_at: "2025-12-28T00:00:00Z", is_seed: true },
];

export async function listApprovedSubmissions(): Promise<Submission[]> {
  const sb = getSupabase();
  if (!sb) return SEED_SUBMISSIONS;
  const { data, error } = await sb
    .from("moni_submissions")
    .select("id,title,username,image_url,status,votes,views,created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error || !data) return SEED_SUBMISSIONS;
  // Seed entries first (chronologically anchored), then approved submissions
  return [...SEED_SUBMISSIONS, ...(data as Submission[])];
}

export async function uploadSubmissionImage(
  file: File
): Promise<{ url: string; path: string } | { error: string }> {
  const sb = getSupabase();
  if (!sb)
    return {
      error:
        "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  if (!["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
    return { error: "Only PNG, JPG, GIF, or WebP." };
  }
  if (file.size > 20 * 1024 * 1024) {
    return { error: "Max 20 MB." };
  }
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await sb.storage
    .from(SUPABASE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error || !data) return { error: error?.message || "Upload failed." };
  const { data: pub } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(data.path);
  return { url: pub.publicUrl, path: data.path };
}

export async function insertSubmission(args: {
  title: string;
  username: string;
  image_url: string;
}): Promise<{ ok: true } | { error: string }> {
  const sb = getSupabase();
  if (!sb) return { error: "Supabase not configured." };
  const { error } = await sb.from("moni_submissions").insert({
    title: args.title.slice(0, 30),
    username: args.username.slice(0, 20),
    image_url: args.image_url,
    status: "pending",
    votes: 0,
    views: 0,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

// Voting — dedup per browser via localStorage. Pure heart-tap UX.
const VOTE_KEY = "moni_votes_v1";

export function getMyVotes(): Record<string, true> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VOTE_KEY) || "{}");
  } catch {
    return {};
  }
}
export function markMyVote(id: string) {
  if (typeof window === "undefined") return;
  const v = getMyVotes();
  v[id] = true;
  localStorage.setItem(VOTE_KEY, JSON.stringify(v));
}

export async function voteSubmission(
  id: string
): Promise<{ votes: number } | { error: string }> {
  // Seed entries: bump the count in localStorage only (no DB row for them)
  if (id.startsWith("seed-")) {
    markMyVote(id);
    return { votes: SEED_SUBMISSIONS.find((s) => s.id === id)?.votes ?? 0 };
  }
  const sb = getSupabase();
  if (!sb) return { error: "Voting requires Supabase." };
  // Increment via RPC — see schema.sql, function increment_submission_votes(uuid)
  const { data, error } = await sb.rpc("increment_submission_votes", {
    submission_id: id,
  });
  if (error) return { error: error.message };
  markMyVote(id);
  return { votes: (data as number) || 0 };
}
