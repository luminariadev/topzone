-- supabase/migrations/0002_orders.sql
-- Create orders and order_items tables

-- Orders table
create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  total       numeric not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Order items (denormalized snapshot of product at time of purchase)
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  product_price numeric not null,
  quantity      integer not null default 1,
  type          text not null check (type in ('game', 'gear')),
  created_at    timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at();

-- Indexes
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Users can only see their own orders
create policy "Users view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users insert own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Users can only see items from their own orders
create policy "Users view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users insert own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
