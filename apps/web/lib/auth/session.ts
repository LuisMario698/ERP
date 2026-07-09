import { roleNames, type RoleName, type TenantContext, type UserProfile } from "@erp/types";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, hasSupabaseConfig } from "../supabase/server";

type CurrentProfile = Pick<UserProfile, "id" | "fullName" | "email" | "activeCompanyId" | "activeBranchId">;

interface CurrentSession {
  userId: string | null;
  email: string | null;
  profile: CurrentProfile | null;
  tenant: TenantContext | null;
}

function isRoleName(value: unknown): value is RoleName {
  return typeof value === "string" && roleNames.includes(value as RoleName);
}

function relationName(value: { name?: unknown } | { name?: unknown }[] | null | undefined) {
  return Array.isArray(value) ? value[0]?.name : value?.name;
}

export async function getCurrentSession(): Promise<CurrentSession> {
  if (!hasSupabaseConfig()) {
    return { userId: null, email: null, profile: null, tenant: null };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, email: null, profile: null, tenant: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, active_company_id, active_branch_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { userId: user.id, email: user.email ?? null, profile: null, tenant: null };
  }

  const currentProfile: CurrentProfile = {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    activeCompanyId: profile.active_company_id,
    activeBranchId: profile.active_branch_id,
  };

  if (!profile.active_company_id || !profile.active_branch_id) {
    return { userId: user.id, email: user.email ?? null, profile: currentProfile, tenant: null };
  }

  const [{ data: company }, { data: branch }, { data: membership }] = await Promise.all([
    supabase.from("companies").select("id, name").eq("id", profile.active_company_id).maybeSingle(),
    supabase.from("branches").select("id, name").eq("id", profile.active_branch_id).maybeSingle(),
    supabase
      .from("user_company_memberships")
      .select("company_id, branch_id, roles(name)")
      .eq("user_id", user.id)
      .eq("company_id", profile.active_company_id)
      .maybeSingle(),
  ]);

  const roleName = relationName(membership?.roles);

  if (!company || !branch || !isRoleName(roleName)) {
    return { userId: user.id, email: user.email ?? null, profile: currentProfile, tenant: null };
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: currentProfile,
    tenant: {
      companyId: company.id,
      branchId: branch.id,
      companyName: company.name,
      branchName: branch.name,
      roleName,
    },
  };
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session.userId) {
    redirect("/login");
  }

  return session;
}

export async function requireTenantContext() {
  const session = await requireUser();

  if (!session.profile || !session.tenant) {
    redirect("/onboarding");
  }

  return {
    ...session,
    profile: session.profile,
    tenant: session.tenant,
  };
}

export async function getOperationalOverview(companyId: string) {
  const supabase = await createServerSupabaseClient();
  const [branches, members, roles] = await Promise.all([
    supabase.from("branches").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    supabase.from("user_company_memberships").select("user_id", { count: "exact", head: true }).eq("company_id", companyId),
    supabase.from("roles").select("id", { count: "exact", head: true }),
  ]);

  return {
    branchesCount: branches.count ?? 0,
    membersCount: members.count ?? 0,
    rolesCount: roles.count ?? 0,
  };
}
