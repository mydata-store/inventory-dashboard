-- Program Control Center V1 - Supabase schema
-- Run in Supabase SQL Editor after reviewing for your project.
create extension if not exists pgcrypto;

create table if not exists public.erp_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  department text,
  phone_number text,
  alternate_phone text,
  employee_code text,
  job_title text,
  remarks text,
  avatar_url text,
  status text not null default 'active' check (status in ('active','disabled')),
  account_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.erp_roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.erp_user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references public.erp_roles(id) on delete cascade,
  primary key (user_id, role_id)
);

create table if not exists public.erp_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.erp_roles(id) on delete cascade,
  page_key text not null,
  can_view boolean not null default false,
  can_add boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_approve boolean not null default false,
  can_print boolean not null default false,
  can_export_pdf boolean not null default false,
  can_export_excel boolean not null default false,
  can_view_rates boolean not null default false,
  can_design boolean not null default false,
  unique(role_id,page_key)
);

create table if not exists public.erp_data_restrictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  department text,
  phone_number text,
  alternate_phone text,
  employee_code text,
  cost_centre text,
  store_location text,
  record_scope text not null default 'all' check(record_scope in ('all','own','department')),
  max_backdate_days integer not null default 0,
  can_view_rates boolean not null default true,
  can_view_values boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.erp_audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.erp_profiles enable row level security;
alter table public.erp_roles enable row level security;
alter table public.erp_user_roles enable row level security;
alter table public.erp_permissions enable row level security;
alter table public.erp_data_restrictions enable row level security;
alter table public.erp_audit_log enable row level security;

-- Helper: super administrator claim is expected in auth.users raw_app_meta_data.role.
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false);
$$;

create policy "profiles self read" on public.erp_profiles for select using (auth.uid()=user_id or public.is_super_admin());
create policy "profiles admin manage" on public.erp_profiles for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "roles authenticated read" on public.erp_roles for select to authenticated using (true);
create policy "roles admin manage" on public.erp_roles for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "user roles self read" on public.erp_user_roles for select using (auth.uid()=user_id or public.is_super_admin());
create policy "user roles admin manage" on public.erp_user_roles for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "permissions authenticated read" on public.erp_permissions for select to authenticated using (true);
create policy "permissions admin manage" on public.erp_permissions for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "restrictions self read" on public.erp_data_restrictions for select using (auth.uid()=user_id or public.is_super_admin());
create policy "restrictions admin manage" on public.erp_data_restrictions for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "audit admin read" on public.erp_audit_log for select using (public.is_super_admin());
create policy "audit authenticated insert" on public.erp_audit_log for insert to authenticated with check (auth.uid()=actor_user_id);

insert into public.erp_roles(name,description,is_system) values
('Super Administrator','Full unrestricted system access',true),
('Administrator','Manage users, settings and operational modules',true),
('Store Manager','Full store operations and reporting',true),
('Store Officer','Daily store entries with limited approvals',true),
('Purchaser','Purchase entry and supplier access',true),
('Gate Pass Officer','RGP, OGP and CGP operations',true),
('Costing Officer','Consumption and costing access',true),
('Report Viewer','Read and print approved reports',true),
('Read Only','View permitted pages only',true)
on conflict(name) do nothing;


-- V2 safety helper: prevents the application from removing the final Super Administrator.
-- Enforce app_metadata role changes through a trusted server-side function or Edge Function.
create unique index if not exists erp_profiles_phone_unique
  on public.erp_profiles(phone_number) where phone_number is not null and phone_number <> '';
