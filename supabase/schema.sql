-- ============================================================
-- REALTY GURUJI — Supabase schema (PostgreSQL)
-- Run this in Supabase → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Roles ----------
do $$ begin
  create type public.user_role as enum ('super_admin', 'property_manager', 'sales_executive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.property_status as enum ('draft', 'available', 'under-offer', 'sold', 'rented');
exception when duplicate_object then null; end $$;

-- ---------- Profiles (linked to auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'sales_executive',
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'sales_executive')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- Role helper functions (SECURITY DEFINER to avoid RLS recursion) ----------
create or replace function public.is_staff() returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid()
    and role in ('super_admin','property_manager','sales_executive'));
$$;

create or replace function public.is_admin() returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid()
    and role in ('super_admin','property_manager'));
$$;

-- ---------- Property categories ----------
create table if not exists public.property_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  kind text not null default 'residential', -- residential | plot | commercial
  sort int not null default 0
);

-- ---------- Agents ----------
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  photo text,
  bio text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Properties ----------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text not null default 'apartments',
  listing_type text not null default 'resale', -- new-launch | resale | rent
  deal_type text not null default 'sale',      -- sale | rent
  bhk int,
  sector int,
  area_name text,
  zone text,
  price bigint not null default 0,
  area numeric,
  area_unit text default 'sqft',               -- sqft | sqyd | acre
  furnishing text default 'unfurnished',
  floor text,
  facing text,
  bathrooms int default 0,
  balconies int default 0,
  parking int default 0,
  description text,
  amenities jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  images jsonb default '[]'::jsonb,
  nearby_places jsonb default '[]'::jsonb,
  latitude numeric,
  longitude numeric,
  roi_estimate text,
  possession text default 'Immediate',
  builder text,
  project_name text,
  rera_number text,
  status public.property_status not null default 'available',
  is_featured boolean not null default false,
  is_hot_deal boolean not null default false,
  is_new_launch boolean not null default false,
  assigned_agent uuid references public.agents(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_category on public.properties(category);
create index if not exists idx_properties_sector on public.properties(sector);
create index if not exists idx_properties_featured on public.properties(is_featured);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_properties_updated on public.properties;
create trigger trg_properties_updated before update on public.properties
  for each row execute function public.touch_updated_at();

-- ---------- Leads ----------
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text,
  budget_min bigint,
  budget_max bigint,
  bhk_preference int,
  sector_preference text,
  property_type text,
  property_category text,
  move_in_timeline text,
  message text,
  source text default 'website',
  property_id uuid references public.properties(id) on delete set null,
  status text not null default 'new', -- new | contacted | site_visit | negotiation | closed | lost
  assigned_to uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created on public.leads(created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_categories enable row level security;
alter table public.agents enable row level security;
alter table public.leads enable row level security;

-- Profiles
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id = auth.uid() or public.is_admin());

-- Properties
drop policy if exists properties_public_read on public.properties;
create policy properties_public_read on public.properties for select
  using (status <> 'draft' or public.is_staff());
drop policy if exists properties_staff_insert on public.properties;
create policy properties_staff_insert on public.properties for insert
  with check (public.is_staff());
drop policy if exists properties_staff_update on public.properties;
create policy properties_staff_update on public.properties for update
  using (public.is_staff());
drop policy if exists properties_admin_delete on public.properties;
create policy properties_admin_delete on public.properties for delete
  using (public.is_admin());

-- Categories
drop policy if exists categories_public_read on public.property_categories;
create policy categories_public_read on public.property_categories for select using (true);
drop policy if exists categories_admin_write on public.property_categories;
create policy categories_admin_write on public.property_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Agents
drop policy if exists agents_public_read on public.agents;
create policy agents_public_read on public.agents for select using (true);
drop policy if exists agents_admin_write on public.agents;
create policy agents_admin_write on public.agents for all
  using (public.is_admin()) with check (public.is_admin());

-- Leads (anyone can submit; staff manage)
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads for insert with check (true);
drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads for select using (public.is_staff());
drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads for update using (public.is_staff());

-- ============================================================
-- Storage bucket for property images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists property_images_public_read on storage.objects;
create policy property_images_public_read on storage.objects for select
  using (bucket_id = 'property-images');
drop policy if exists property_images_staff_write on storage.objects;
create policy property_images_staff_write on storage.objects for insert
  with check (bucket_id = 'property-images' and public.is_staff());
drop policy if exists property_images_staff_update on storage.objects;
create policy property_images_staff_update on storage.objects for update
  using (bucket_id = 'property-images' and public.is_staff());
drop policy if exists property_images_staff_delete on storage.objects;
create policy property_images_staff_delete on storage.objects for delete
  using (bucket_id = 'property-images' and public.is_staff());

-- ============================================================
-- Seed: categories
-- ============================================================
insert into public.property_categories (slug, name, kind, sort) values
  ('apartments', 'Apartments', 'residential', 1),
  ('villas', 'Villas', 'residential', 2),
  ('penthouses', 'Penthouses', 'residential', 3),
  ('builder-floors', 'Builder Floors', 'residential', 4),
  ('luxury-homes', 'Luxury Homes', 'residential', 5),
  ('farmhouses', 'Farmhouses', 'residential', 6),
  ('residential-plots', 'Residential Plots', 'plot', 7),
  ('commercial-plots', 'Commercial Plots', 'plot', 8),
  ('sco-plots', 'SCO Plots', 'plot', 9),
  ('office-spaces', 'Office Spaces', 'commercial', 10)
on conflict (slug) do nothing;

-- ============================================================
-- AFTER you sign up your first admin user in Authentication → Users,
-- promote them to super_admin by running (replace the email):
--
--   update public.profiles set role = 'super_admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================
