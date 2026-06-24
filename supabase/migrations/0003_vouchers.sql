-- supabase/migrations/0003_vouchers.sql
-- Create vouchers table for promotional codes

-- Vouchers table
create table if not exists vouchers (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  description     text not null default '',
  discount_type   text not null check (discount_type in ('percentage', 'fixed')),
  discount_value  numeric not null default 0,
  min_purchase    numeric not null default 0,
  max_discount    numeric,
  usage_limit     integer,
  used_count      integer not null default 0,
  user_limit      integer not null default 1,
  valid_from      timestamptz not null default now(),
  valid_until     timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Voucher usage tracking
create table if not exists voucher_usages (
  id          uuid primary key default gen_random_uuid(),
  voucher_id  uuid not null references vouchers(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  order_id    uuid references orders(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_vouchers_code on vouchers(code);
create index if not exists idx_vouchers_active on vouchers(is_active);
create index if not exists idx_vouchers_valid_until on vouchers(valid_until);
create index if not exists idx_voucher_usages_voucher_id on voucher_usages(voucher_id);
create index if not exists idx_voucher_usages_user_id on voucher_usages(user_id);
create index if not exists idx_voucher_usages_order_id on voucher_usages(order_id);

-- Enable RLS
alter table vouchers enable row level security;
alter table voucher_usages enable row level security;

-- RLS policies
create policy "Active vouchers are viewable by everyone"
  on vouchers for select
  using (is_active = true and valid_from <= now() and (valid_until is null or valid_until >= now()));

create policy "Users view own voucher usage"
  on voucher_usages for select
  using (auth.uid() = user_id);

create policy "Users insert own voucher usage"
  on voucher_usages for insert
  with check (auth.uid() = user_id);

-- Grant permissions for REST API access
GRANT SELECT ON vouchers TO anon;
GRANT SELECT ON vouchers TO service_role;
GRANT SELECT ON voucher_usages TO anon;
GRANT SELECT ON voucher_usages TO service_role;
GRANT INSERT ON voucher_usages TO service_role;