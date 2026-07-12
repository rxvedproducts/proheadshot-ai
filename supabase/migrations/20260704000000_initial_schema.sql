-- ProHeadshot AI — Database Schema
-- Run this in the Supabase SQL Editor (or `supabase db push`) on a fresh project.
-- Reconstructed from application code: services/supabaseService.ts, api/generate-headshot.ts,
-- supabase/functions/{create-checkout,stripe-webhook,generate-headshot}/index.ts

-- ============================================================
-- 1. plans — lookup table for purchasable credit packs
-- ============================================================
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  credits integer not null,
  created_at timestamptz not null default now()
);

insert into plans (name, slug, credits)
values
  ('Individual', 'individual', 20),
  ('Team', 'team', 50)
on conflict (slug) do nothing;

-- ============================================================
-- 2. profiles — one row per auth user; credit wallet
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  credits integer not null default 3,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, credits)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    3
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- 3. purchases — audit log of completed Stripe checkouts
-- ============================================================
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references plans(id),
  stripe_session_id text unique,
  amount_paid integer,
  credits_added integer,
  created_at timestamptz not null default now()
);

alter table purchases enable row level security;

create policy "Users can view their own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- Note: inserts/updates to purchases and profiles.credits happen only via
-- Supabase Edge Functions using the service_role key, which bypasses RLS.

-- ============================================================
-- 4. generated_images — history of AI-generated headshots
-- ============================================================
create table if not exists generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_image_path text,
  generated_image_path text not null,
  style_id text,
  created_at timestamptz not null default now()
);

alter table generated_images enable row level security;

create policy "Users can view their own generated images"
  on generated_images for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generated images"
  on generated_images for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own generated images"
  on generated_images for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 5. Storage — bucket for original & generated headshot images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Path convention: {user_id}/{originals|generated}/{filename}
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view images (public bucket)"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
