export type EntityStatus = "active" | "inactive";
export type CompanyId = string;
export type BranchId = string;
export type UserProfileId = string;
export type RoleId = string;

export const roleNames = ["Administrador", "Gerente", "Cajero", "Inventario", "Supervisor"] as const;
export type RoleName = (typeof roleNames)[number];

export interface Company {
  id: CompanyId;
  name: string;
  taxId: string | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: BranchId;
  companyId: CompanyId;
  name: string;
  code: string | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: RoleId;
  name: RoleName;
  description: string | null;
}

export interface UserProfile {
  id: UserProfileId;
  fullName: string;
  email: string;
  activeCompanyId: CompanyId | null;
  activeBranchId: BranchId | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantContext {
  companyId: CompanyId;
  branchId: BranchId;
  companyName: string;
  branchName: string;
  roleName: RoleName;
}

export type ActiveTenantContext = TenantContext;
