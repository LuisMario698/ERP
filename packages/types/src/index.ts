export type CompanyId = string;
export type BranchId = string;

export interface ActiveTenantContext {
  companyId: CompanyId;
  branchId: BranchId;
}
