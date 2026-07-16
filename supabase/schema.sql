-- ============================================================
-- NS Interview Prep — Complete Supabase Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. PROFILES ──────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  university  text,
  program     text,
  role        text not null default 'student', -- 'student' | 'admin'
  created_at  timestamptz default now()
);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, university, program, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'university', ''),
    coalesce(new.raw_user_meta_data->>'program', ''),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admin can read all profiles
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── 2. INTERVIEW SESSIONS ──────────────────────────────────────
create table if not exists public.interview_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade,
  field            text,
  field_label      text,
  target_company   text,
  interviewer_mode text default 'male',
  total_questions  int default 8,
  status           text default 'active', -- 'active' | 'completed' | 'scheduled'
  scheduled_for    timestamptz,
  started_at       timestamptz default now(),
  ended_at         timestamptz,
  video_url        text
);

alter table public.interview_sessions enable row level security;

drop policy if exists "Users manage own sessions" on public.interview_sessions;
create policy "Users manage own sessions"
  on public.interview_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read all sessions" on public.interview_sessions;
create policy "Admins read all sessions"
  on public.interview_sessions for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 3. INTERVIEW TURNS ────────────────────────────────────────
create table if not exists public.interview_turns (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid references public.interview_sessions(id) on delete cascade,
  turn_number      int,
  role             text, -- 'ai' | 'student'
  interviewer_name text,
  text             text,
  created_at       timestamptz default now()
);

alter table public.interview_turns enable row level security;

drop policy if exists "Users manage own turns" on public.interview_turns;
create policy "Users manage own turns"
  on public.interview_turns for all
  using (
    exists (
      select 1 from public.interview_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.interview_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Admins read all turns" on public.interview_turns;
create policy "Admins read all turns"
  on public.interview_turns for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 4. GRADING REPORTS ────────────────────────────────────────
create table if not exists public.grading_reports (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid references public.interview_sessions(id) on delete cascade,
  overall_score       int,
  communication_score int,
  technical_score     int,
  relevance_score     int,
  confidence_score    int,
  feedback_text       text,
  improvement_notes   text[],
  generated_at        timestamptz default now()
);

alter table public.grading_reports enable row level security;

drop policy if exists "Users read own grades" on public.grading_reports;
create policy "Users read own grades"
  on public.grading_reports for select
  using (
    exists (
      select 1 from public.interview_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users insert own grades" on public.grading_reports;
create policy "Users insert own grades"
  on public.grading_reports for insert
  with check (
    exists (
      select 1 from public.interview_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Admins read all grades" on public.grading_reports;
create policy "Admins read all grades"
  on public.grading_reports for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 5. APTITUDE TESTS ─────────────────────────────────────────
create table if not exists public.aptitude_tests (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text not null,
  category    text default 'general', -- 'general' | 'technical' | 'behavioral' | 'logical'
  field       text,
  description text,
  is_active   boolean default true,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz default now()
);

alter table public.aptitude_tests enable row level security;

drop policy if exists "Anyone authenticated reads active tests" on public.aptitude_tests;
create policy "Anyone authenticated reads active tests"
  on public.aptitude_tests for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins manage tests" on public.aptitude_tests;
create policy "Admins manage tests"
  on public.aptitude_tests for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 6. APTITUDE COMPLETIONS ───────────────────────────────────
create table if not exists public.aptitude_completions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade,
  test_id    uuid references public.aptitude_tests(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, test_id)
);

alter table public.aptitude_completions enable row level security;

drop policy if exists "Users manage own completions" on public.aptitude_completions;
create policy "Users manage own completions"
  on public.aptitude_completions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read all completions" on public.aptitude_completions;
create policy "Admins read all completions"
  on public.aptitude_completions for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 7. STORAGE BUCKETS ────────────────────────────────────────
-- Run these only if buckets don't already exist
insert into storage.buckets (id, name, public)
values ('interview-videos', 'interview-videos', true)
on conflict (id) do nothing;

-- Storage RLS: users can upload/read own videos
drop policy if exists "Users upload own videos" on storage.objects;
create policy "Users upload own videos"
  on storage.objects for insert
  with check (
    bucket_id = 'interview-videos' and
    auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "Anyone can read videos" on storage.objects;
create policy "Anyone can read videos"
  on storage.objects for select
  using (bucket_id = 'interview-videos');

drop policy if exists "Users update own videos" on storage.objects;
create policy "Users update own videos"
  on storage.objects for update
  using (
    bucket_id = 'interview-videos' and
    auth.uid()::text = split_part(name, '/', 1)
  );

-- ── 8. MAKE YOURSELF ADMIN ────────────────────────────────────
-- After you sign up with your admin email, run this:
-- Replace 'your-admin@email.com' with your actual email.
--
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'your-admin@email.com');

-- ── 9. STUDENT QUESTIONS FOR ADMIN ──────────────────────────────────────────
create table if not exists public.admin_questions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade,
  session_id   uuid references public.interview_sessions(id) on delete set null,
  question     text not null,
  answer       text,
  answered_by  uuid references public.profiles(id),
  answered_at  timestamptz,
  created_at   timestamptz default now()
);

alter table public.admin_questions enable row level security;

drop policy if exists "Users manage own questions" on public.admin_questions;
create policy "Users manage own questions"
  on public.admin_questions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins manage all questions" on public.admin_questions;
create policy "Admins manage all questions"
  on public.admin_questions for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
