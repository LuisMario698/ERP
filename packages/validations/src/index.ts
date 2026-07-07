import { z } from "zod";

export const activeTenantContextSchema = z.object({
  companyId: z.string().uuid(),
  branchId: z.string().uuid(),
});
