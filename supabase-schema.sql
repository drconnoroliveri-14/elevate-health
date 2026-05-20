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
