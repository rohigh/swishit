-- ─────────────────────────────────────────────────────────────────────────────
-- SWISH IT: Idempotent Orders Table & Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rkuimykdydkrfwmaujgb/sql/new
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  order_number text not null,
  items jsonb not null,
  subtotal numeric not null,
  shipping_fee numeric not null,
  total numeric not null,
  payment_method text not null,
  shipping_address jsonb not null,
  status text default 'Processing' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.orders enable row level security;

-- Drop policies if they already exist to prevent duplicate errors
drop policy if exists "Users can view their own orders" on public.orders;
drop policy if exists "Users can insert their own orders" on public.orders;

-- Policy 1: Users can view their own orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Policy 2: Users can insert their own orders
create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);
