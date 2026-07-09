"use server";

import { onboardingSchema } from "@erp/validations";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export interface OnboardingActionState {
  error?: string;
}

export async function completeOnboardingAction(_state: OnboardingActionState, formData: FormData): Promise<OnboardingActionState> {
  const parsed = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
    branchName: formData.get("branchName"),
  });

  if (!parsed.success) {
    return { error: "Revisa los datos de empresa, sucursal y nombre." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("create_company_onboarding", {
    company_name_input: parsed.data.companyName,
    branch_name_input: parsed.data.branchName,
    full_name_input: parsed.data.fullName,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function completeOnboardingFormAction(formData: FormData) {
  const result = await completeOnboardingAction({}, formData);

  if (result.error) {
    redirect(`/onboarding?error=${encodeURIComponent(result.error)}`);
  }
}
