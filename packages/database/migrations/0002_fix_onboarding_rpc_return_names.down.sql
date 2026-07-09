begin;

drop function if exists public.create_company_onboarding(text, text, text);

create or replace function public.create_company_onboarding(
  company_name_input text,
  branch_name_input text,
  full_name_input text
)
returns table(company_id uuid, branch_id uuid, profile_id uuid)
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

  select id into admin_role_id from public.roles where name = 'Administrador';

  insert into public.profiles (id, full_name, email)
  values (current_user_id, trim(full_name_input), current_email)
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        updated_at = now();

  insert into public.companies (name, created_by)
  values (trim(company_name_input), current_user_id)
  returning id into created_company_id;

  insert into public.branches (company_id, name, code)
  values (created_company_id, trim(branch_name_input), 'MAIN')
  returning id into created_branch_id;

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
  where id = current_user_id;

  return query select created_company_id, created_branch_id, current_user_id;
end;
$$;

grant execute on function public.create_company_onboarding(text, text, text) to authenticated;

commit;
