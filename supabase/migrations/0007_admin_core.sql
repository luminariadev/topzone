-- supabase/migrations/0007_admin_core.sql
-- Admin role & permissions tables (Phase 1.5)

create type admin_role as enum ('super_admin', 'admin', 'staff');

create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  auth_id       uuid references auth.users(id) on delete cascade unique,
  email         text not null unique,
  full_name     text not null default '',
  role          admin_role not null default 'staff',
  is_active     boolean not null default true,
  last_login    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists audit_log (
  id            uuid primary key default gen_random_uuid(),
  admin_id      uuid references admin_users(id) on delete set null,
  admin_email   text not null,
  action        text not null,
  entity_type   text not null,
  entity_id     text,
  details       jsonb default '{}',
  ip_address    text,
  created_at    timestamptz not null default now()
);

alter table admin_users enable row level security;
alter table audit_log enable row level security;

create index if not exists idx_admin_users_email on admin_users(email);
create index if not exists idx_audit_log_admin on audit_log(admin_id);
create index if not exists idx_audit_log_created on audit_log(created_at desc);

create policy "super_admin_manage_admin_users"
  on admin_users for all
  using (auth.jwt() ->> 'email' in (select email from admin_users where role = 'super_admin'))
  with check (auth.jwt() ->> 'email' in (select email from admin_users where role = 'super_admin'));

create policy "admin_read_audit_log"
  on audit_log for select
  using (auth.jwt() ->> 'email' in (select email from admin_users where role in ('super_admin', 'admin')));

create policy "admin_insert_audit_log"
  on audit_log for insert
  with check (auth.jwt() ->> 'email' in (select email from admin_users));
