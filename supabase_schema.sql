-- Textile Design Management System - Supabase Schema
-- Run this in your Supabase SQL Editor to create all required tables

-- Designs table
create table if not exists designs (
  id uuid default gen_random_uuid() primary key,
  design_number text unique not null,
  design_name text,
  dn text,
  dn_code text,
  reed text,
  pick text,
  cards text,
  patti text,
  total_dc text,
  total_cut text,
  work text,
  blue_apt text,
  description text,
  remarks text,
  image_path text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

-- Feeders table
create table if not exists feeders (
  id uuid default gen_random_uuid() primary key,
  design_id uuid references designs(id) on delete cascade,
  feeder_number integer not null default 1,
  color_name text,
  old_number text
);

-- Settings table
create table if not exists settings (
  key text primary key,
  value text
);

-- Indexes for fast search
create index if not exists idx_designs_number on designs(design_number);
create index if not exists idx_designs_dn on designs(dn);
create index if not exists idx_designs_work on designs(work);
create index if not exists idx_feeders_design_id on feeders(design_id);
create index if not exists idx_feeders_color on feeders(color_name);
create index if not exists idx_feeders_old_number on feeders(old_number);

-- Enable RLS (Row Level Security) - optional for security
-- alter table designs enable row level security;
-- alter table feeders enable row level security;
-- alter table settings enable row level security;

-- Default settings
insert into settings (key, value) values
  ('app_name', 'Textile Manager'),
  ('company_name', 'Your Company'),
  ('whatsapp_number', '')
on conflict (key) do nothing;
