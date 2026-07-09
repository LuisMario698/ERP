import { z } from "zod";

const requiredName = z.string().trim().min(2).max(120);
const optionalCode = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((value) => (value ? value : undefined));

export const requiredString = z.string().trim().min(1);

export const activeTenantContextSchema = z.object({
  companyId: z.string().uuid(),
  branchId: z.string().uuid(),
});

export const companySchema = z.object({
  name: requiredName,
  taxId: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export const branchSchema = z.object({
  companyId: z.string().uuid(),
  name: requiredName,
  code: optionalCode,
});

export const userProfileSchema = z.object({
  fullName: requiredName,
  email: z.string().trim().email(),
});

export const onboardingSchema = z.object({
  fullName: requiredName,
  companyName: requiredName,
  branchName: requiredName,
});

export type CompanyInput = z.infer<typeof companySchema>;
export type BranchInput = z.infer<typeof branchSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
