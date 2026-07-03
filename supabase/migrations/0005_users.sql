-- supabase/migrations/0005_users.sql
-- Create users profile and admin tables

-- Users profile (extends auth.users)
create table if not exists user_profiles (
  id            uuid primary key default gen_random_uuid(),
  auth_id       uuid not null references auth.users(id) on delete cascade unique,
  email         text not null,
  full_name     text not null default '',
  phone         text default '',
  avatar_url    text default '',
  date_of_birth date,
  is_active     boolean not null default true,
  is_verified   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies for avatars
create policy "Avatars are publicly accessible"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Users can update their own avatars"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Users can delete their own avatars"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '/', 1)
  );

-- Admin users
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  full_name     text not null,
  role          text not null default 'admin' check (role in ('super_admin', 'admin', 'staff')),
  is_active     boolean not null default true,
  last_login    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indexes
create index if not exists idx_user_profiles_auth_id on user_profiles(auth_id);
create index if not exists idx_user_profiles_email on user_profiles(email);
create index if not exists idx_admin_users_email on admin_users(email);
create index if not exists idx_admin_users_role on admin_users(role);

-- Enable RLS
alter table user_profiles enable row level security;
alter table admin_users enable row level security;

-- RLS: users can manage own profile
create policy "Users view own profile"
  on user_profiles for select
  using (auth.uid() = auth_id);

create policy "Users insert own profile"
  on user_profiles for insert
  with check (auth.uid() = auth_id);

create policy "Users update own profile"
  on user_profiles for update
  using (auth.uid() = auth_id);

-- Admin users management
create policy "Admins manage user profiles"
  on user_profiles for all
  using (
    exists (
      select 1 from admin_users
      where email = (auth.jwt()->>'email')
        and is_active = true
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO service_role;
GRANT SELECT ON admin_users TO service_role;