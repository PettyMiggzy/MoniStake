-- ════════════════════════════════════════════════════════════════
-- MONI gallery — Supabase schema
-- Run this once in your Supabase SQL editor before the gallery /
-- Submit a Creation feature will work end-to-end.
-- ════════════════════════════════════════════════════════════════

-- ─── 1. Tables ──────────────────────────────────────────────────

create table if not exists public.moni_submissions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(title) between 1 and 30),
  username    text not null check (length(username) between 1 and 20),
  image_url   text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  votes       integer not null default 0,
  views       integer not null default 0,
  submitter   text,  -- optional wallet address or fingerprint
  created_at  timestamptz not null default now()
);

create index if not exists moni_submissions_status_idx
  on public.moni_submissions(status, created_at desc);

-- ─── 2. Row-Level Security ──────────────────────────────────────
--
-- Reads: anyone can read approved submissions.
-- Writes: anyone can INSERT a 'pending' row (anti-spam is at the API
--         layer via rate limiting on uploads). Only the service role
--         can UPDATE status to approved/rejected.

alter table public.moni_submissions enable row level security;

drop policy if exists "Anyone reads approved" on public.moni_submissions;
create policy "Anyone reads approved"
  on public.moni_submissions for select
  using (status = 'approved');

drop policy if exists "Anonymous can submit" on public.moni_submissions;
create policy "Anonymous can submit"
  on public.moni_submissions for insert
  with check (status = 'pending' and votes = 0 and views = 0);

-- ─── 3. Vote increment RPC ──────────────────────────────────────
--
-- Called from the client to bump the votes counter on a submission.
-- Returns the new total. Per-browser deduping happens client-side via
-- localStorage; this just guards against negative votes.

create or replace function public.increment_submission_votes(submission_id uuid)
returns integer
language plpgsql security definer
as $$
declare
  new_count integer;
begin
  update public.moni_submissions
     set votes = votes + 1
   where id = submission_id and status = 'approved'
  returning votes into new_count;
  return coalesce(new_count, 0);
end;
$$;

grant execute on function public.increment_submission_votes(uuid) to anon, authenticated;

-- ─── 4. View counter RPC ────────────────────────────────────────

create or replace function public.increment_submission_views(submission_id uuid)
returns integer
language plpgsql security definer
as $$
declare
  new_count integer;
begin
  update public.moni_submissions
     set views = views + 1
   where id = submission_id and status = 'approved'
  returning views into new_count;
  return coalesce(new_count, 0);
end;
$$;

grant execute on function public.increment_submission_views(uuid) to anon, authenticated;

-- ─── 5. Storage bucket ──────────────────────────────────────────
--
-- Run this in the Supabase UI: Storage → New Bucket → name "moni-submissions",
-- public access ON. Or via SQL:

insert into storage.buckets (id, name, public)
values ('moni-submissions', 'moni-submissions', true)
on conflict (id) do nothing;

-- Anyone can read; anyone authenticated (incl. anon) can upload.
-- Service role can delete.

drop policy if exists "Public read moni images" on storage.objects;
create policy "Public read moni images"
  on storage.objects for select
  using (bucket_id = 'moni-submissions');

drop policy if exists "Anyone can upload moni images" on storage.objects;
create policy "Anyone can upload moni images"
  on storage.objects for insert
  with check (bucket_id = 'moni-submissions');

-- ════════════════════════════════════════════════════════════════
-- After running this:
--   1. Add to your Vercel env:
--      NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
--      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
--   2. Submissions start as 'pending'. Manually flip to 'approved' in
--      the Supabase Table Editor → moni_submissions, or write a
--      moderator UI. Approved entries appear in the public gallery.
--   3. Seed entries (the original 3 from monitheyeti.com) are hard-
--      coded in lib/supabase.ts — they always appear first.
-- ════════════════════════════════════════════════════════════════
