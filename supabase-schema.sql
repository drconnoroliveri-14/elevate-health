-- Elevate Health — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.

create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  role text default 'student',
  stripe_customer_id text,
  stripe_session_id text,
  purchased_at timestamptz,
  has_nutrition_course boolean default false,
  has_consultation boolean default false,
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  source text,
  purchased boolean default false,
  created_at timestamptz default now()
);

create table module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  module_number int,
  unlocked_at timestamptz,
  first_accessed_at timestamptz,
  completed_at timestamptz,
  unique(user_id, module_number)
);

create table email_log (
  id uuid primary key default gen_random_uuid(),
  recipient_email text,
  email_type text,
  sent_at timestamptz default now(),
  status text
);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table leads enable row level security;
alter table module_progress enable row level security;
alter table email_log enable row level security;

-- Profiles: students see only their own row; admins see all
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Module progress: students see/update only their own rows
create policy "Users can view own progress"
  on module_progress for select
  using (auth.uid() = user_id);

create policy "Users can update own progress"
  on module_progress for update
  using (auth.uid() = user_id);

create policy "Admins can view all progress"
  on module_progress for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Leads: only service role (backend) can read/write; admins via service role
-- No direct client access needed for leads table

-- Email log: only service role (backend) can read/write
-- No direct client access needed for email_log table

-- Service-role bypass: the SUPABASE_SERVICE_ROLE_KEY used in API routes
-- bypasses RLS automatically, so webhooks and admin API routes work without
-- additional policies.

-- ── Migration: upsell product flags ─────────────────────────────────────────
-- Run these two statements in the Supabase SQL editor to add the new columns:
alter table profiles add column if not exists has_nutrition_course boolean default false;
alter table profiles add column if not exists has_consultation boolean default false;
alter table profiles add column if not exists consultation_booked boolean default false;

-- Shopping list progress (interactive checklist in nutrition course)
create table if not exists shopping_list_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  item_key text not null,
  checked boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, item_key)
);

alter table shopping_list_progress enable row level security;

create policy "Users can manage own shopping list"
  on shopping_list_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Pain journal (interactive pain tracking tool)
create table if not exists pain_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  entry_date date not null,
  neck_pain smallint check (neck_pain between 0 and 10),
  mid_back_pain smallint check (mid_back_pain between 0 and 10),
  lower_back_pain smallint check (lower_back_pain between 0 and 10),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table pain_journal enable row level security;

create policy "Users can manage own journal"
  on pain_journal for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Migration: add login tracking columns to profiles
alter table profiles add column if not exists login_dates jsonb default '[]'::jsonb;
alter table profiles add column if not exists last_login timestamptz;

-- ── Posture Photo Tracker ────────────────────────────────────────────────────
-- Run these statements in the Supabase SQL editor:
create table if not exists posture_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  photo_url text not null,
  photo_date date not null,
  day_number int,
  view_type text check (view_type in ('front', 'side', 'back')),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, photo_date, view_type)
);
alter table posture_photos enable row level security;
create policy "Users can manage own posture photos"
  on posture_photos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Supabase Storage bucket setup (do this in the Supabase dashboard):
-- 1. Go to Storage → New bucket
-- 2. Name: posture-photos
-- 3. Public: OFF (private)
-- 4. Click Create bucket
-- 5. Go to Storage → Policies → posture-photos bucket
-- 6. Add a policy for all operations with this expression:
--    (auth.uid()::text = (storage.foldername(name))[1])
-- This ensures users can only access their own folder (/{userId}/...).
