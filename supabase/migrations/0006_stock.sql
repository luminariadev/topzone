-- supabase/migrations/0006_stock.sql
-- Add stock field to existing tables

-- Add stock to product_packages
alter table if exists product_packages add column if not exists stock integer not null default 999;
alter table if exists product_packages add column if not exists low_stock_threshold integer not null default 5;

-- Add stock to gear_specs (for gear items)
alter table if exists gear_specs add column if not exists stock integer not null default 999;
alter table if exists gear_specs add column if not exists low_stock_threshold integer not null default 5;

-- Create stock history log
create table if not exists stock_history (
  id uuid primary key default gen_random_uuid(),
  product_type text not null check (product_type in ('game', 'gear')),
  product_id text not null,
  package_id text not null default '',
  change_type text not null check (change_type in ('purchase', 'restock', 'adjustment', 'cancellation')),
  quantity_change integer not null,
  stock_after integer not null,
  order_id text,
  note text default '',
  created_by text default 'system',
  created_at timestamptz not null default now()
);

-- Create indexes
create index if not exists idx_stock_history_product on stock_history(product_type, product_id);
create index if not exists idx_stock_history_created on stock_history(created_at desc);
create index if not exists idx_stock_history_order on stock_history(order_id);
