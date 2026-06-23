-- supabase/migrations/0001_products.sql
-- Create products and product_packages tables

-- Products table (games + gear)
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  type        text not null check (type in ('game', 'gear')),
  description text not null default '',
  category    text not null default '',
  img         text not null default '',
  badge       text not null default '',
  tag         text not null default '',
  color       text not null default '#39FF14',
  currency    text not null default '',
  price       numeric not null default 0,
  created_at  timestamptz not null default now()
);

-- Game top-up packages
create table if not exists product_packages (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  price       numeric not null default 0
);

-- Gear specifications
create table if not exists gear_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  value       text not null
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_type on products(type);
create index if not exists idx_products_category on products(category);
create index if not exists idx_product_packages_product_id on product_packages(product_id);
create index if not exists idx_gear_specs_product_id on gear_specs(product_id);

-- Enable RLS
alter table products enable row level security;
alter table product_packages enable row level security;
alter table gear_specs enable row level security;

-- Public read access for products
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- Grant permissions for REST API access
GRANT SELECT ON products TO anon;
GRANT SELECT ON product_packages TO anon;
GRANT SELECT ON gear_specs TO anon;
GRANT SELECT ON products TO service_role;
GRANT SELECT ON product_packages TO service_role;
GRANT SELECT ON gear_specs TO service_role;

-- Public read access for packages
create policy "Packages are viewable by everyone"
  on product_packages for select
  using (true);

-- Public read access for gear specs
create policy "Gear specs are viewable by everyone"
  on gear_specs for select
  using (true);
