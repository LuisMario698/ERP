begin;

drop policy if exists memberships_update_admin on public.user_company_memberships;
drop policy if exists memberships_insert_admin on public.user_company_memberships;
drop policy if exists memberships_select_related on public.user_company_memberships;
drop policy if exists branches_update_admin on public.branches;
drop policy if exists branches_insert_admin on public.branches;
drop policy if exists branches_select_member on public.branches;
drop policy if exists companies_update_admin on public.companies;
drop policy if exists companies_select_member on public.companies;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists profiles_insert_self on public.profiles;
drop policy if exists profiles_select_self on public.profiles;
drop policy if exists roles_select_authenticated on public.roles;

drop function if exists public.create_company_onboarding(text, text, text);
drop function if exists public.is_company_admin(uuid);
drop function if exists public.is_company_member(uuid);

drop trigger if exists profiles_set_updated_at on public.profiles;
drop trigger if exists branches_set_updated_at on public.branches;
drop trigger if exists companies_set_updated_at on public.companies;
drop function if exists public.set_updated_at();

drop table if exists public.user_company_memberships;
drop table if exists public.profiles;
drop table if exists public.branches;
drop table if exists public.companies;
drop table if exists public.roles;

drop type if exists public.role_name;
drop type if exists public.entity_status;

commit;
