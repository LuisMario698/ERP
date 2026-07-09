begin;

create extension if not exists "pgcrypto";

do $$
begin
  create type public.entity_status as enum ('active', 'inactive');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.role_name as enum ('Administrador', 'Gerente', 'Cajero', 'Inventario', 'Supervisor');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name public.role_name not null unique,
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  status public.entity_status not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  code text,
  status public.entity_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  active_company_id uuid references public.companies(id) on delete set null,
  active_branch_id uuid references public.branches(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_company_memberships (
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  role_id uuid not null references public.roles(id) on delete restrict,
  status public.entity_status not null default 'active',
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

create index if not exists companies_name_idx on public.companies(name);
create index if not exists companies_status_idx on public.companies(status);
create index if not exists branches_company_id_idx on public.branches(company_id);
create unique index if not exists branches_company_code_idx on public.branches(company_id, code) where code is not null;
create index if not exists memberships_user_id_idx on public.user_company_memberships(user_id);
create index if not exists memberships_company_id_idx on public.user_company_memberships(company_id);

insert into public.roles (name, description)
values
  ('Administrador', 'Control total de empresa, sucursales, usuarios y configuracion.'),
  ('Gerente', 'Operacion y supervision de sucursales asignadas.'),
  ('Cajero', 'Operacion de caja y ventas.'),
  ('Inventario', 'Gestion de productos, existencias y movimientos.'),
  ('Supervisor', 'Consulta y supervision operativa.')
on conflict (name) do update set description = excluded.description;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists branches_set_updated_at on public.branches;
create trigger branches_set_updated_at
before update on public.branches
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_company_memberships membership
    where membership.company_id = target_company_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create or replace function public.is_company_admin(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_company_memberships membership
    join public.roles role on role.id = membership.role_id
    where membership.company_id = target_company_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and role.name = 'Administrador'
  );
$$;

create or replace function public.create_company_onboarding(
  company_name_input text,
  branch_name_input text,
  full_name_input text
)
returns table(onboarded_company_id uuid, onboarded_branch_id uuid, onboarded_profile_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text := coalesce(auth.jwt() ->> 'email', '');
  admin_role_id uuid;
  created_company_id uuid;
  created_branch_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if length(trim(company_name_input)) < 2 or length(trim(branch_name_input)) < 2 or length(trim(full_name_input)) < 2 then
    raise exception 'Company, branch and full name are required';
  end if;

  select role.id into admin_role_id from public.roles role where role.name = 'Administrador';

  insert into public.profiles (id, full_name, email)
  values (current_user_id, trim(full_name_input), current_email)
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        updated_at = now();

  insert into public.companies (name, created_by)
  values (trim(company_name_input), current_user_id)
  returning companies.id into created_company_id;

  insert into public.branches (company_id, name, code)
  values (created_company_id, trim(branch_name_input), 'MAIN')
  returning branches.id into created_branch_id;

  insert into public.user_company_memberships (user_id, company_id, branch_id, role_id)
  values (current_user_id, created_company_id, created_branch_id, admin_role_id)
  on conflict (user_id, company_id) do update
    set branch_id = excluded.branch_id,
        role_id = excluded.role_id,
        status = 'active';

  update public.profiles
  set active_company_id = created_company_id,
      active_branch_id = created_branch_id,
      updated_at = now()
  where profiles.id = current_user_id;

  return query select created_company_id, created_branch_id, current_user_id;
end;
$$;

alter table public.roles enable row level security;
alter table public.companies enable row level security;
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.user_company_memberships enable row level security;

drop policy if exists roles_select_authenticated on public.roles;
create policy roles_select_authenticated
on public.roles for select
to authenticated
using (true);

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists companies_select_member on public.companies;
create policy companies_select_member
on public.companies for select
to authenticated
using (public.is_company_member(id));

drop policy if exists companies_update_admin on public.companies;
create policy companies_update_admin
on public.companies for update
to authenticated
using (public.is_company_admin(id))
with check (public.is_company_admin(id));

drop policy if exists branches_select_member on public.branches;
create policy branches_select_member
on public.branches for select
to authenticated
using (public.is_company_member(company_id));

drop policy if exists branches_insert_admin on public.branches;
create policy branches_insert_admin
on public.branches for insert
to authenticated
with check (public.is_company_admin(company_id));

drop policy if exists branches_update_admin on public.branches;
create policy branches_update_admin
on public.branches for update
to authenticated
using (public.is_company_admin(company_id))
with check (public.is_company_admin(company_id));

drop policy if exists memberships_select_related on public.user_company_memberships;
create policy memberships_select_related
on public.user_company_memberships for select
to authenticated
using (user_id = auth.uid() or public.is_company_admin(company_id));

drop policy if exists memberships_insert_admin on public.user_company_memberships;
create policy memberships_insert_admin
on public.user_company_memberships for insert
to authenticated
with check (public.is_company_admin(company_id));

drop policy if exists memberships_update_admin on public.user_company_memberships;
create policy memberships_update_admin
on public.user_company_memberships for update
to authenticated
using (public.is_company_admin(company_id))
with check (public.is_company_admin(company_id));

grant execute on function public.create_company_onboarding(text, text, text) to authenticated;

commit;
