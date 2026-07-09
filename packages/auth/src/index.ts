import { roleNames, type RoleName, type TenantContext, type UserProfile } from "@erp/types";

export const initialRoles = roleNames;
export type InitialRole = RoleName;

export const publicAuthRoutes = ["/login", "/registro"] as const;

export function isAdministrator(roleName: RoleName) {
  return roleName === "Administrador";
}

export function getPostAuthRedirect(profile: Pick<UserProfile, "activeCompanyId" | "activeBranchId"> | null) {
  return profile?.activeCompanyId && profile.activeBranchId ? "/" : "/onboarding";
}

export function hasCompleteTenantContext(context: TenantContext | null) {
  return Boolean(context?.companyId && context.branchId && context.roleName);
}
