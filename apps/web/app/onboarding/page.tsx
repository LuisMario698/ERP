import { redirect } from "next/navigation";
import { completeOnboardingFormAction } from "../actions/onboarding";
import { requireUser } from "../../lib/auth/session";

export const dynamic = "force-dynamic";

interface OnboardingPageProps {
  searchParams?: Promise<{ error?: string }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const session = await requireUser();
  const params = await searchParams;

  if (session.profile?.activeCompanyId && session.profile.activeBranchId) {
    redirect("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-10">
      <form action={completeOnboardingFormAction} className="w-full max-w-xl rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-slate-500">{session.email ?? "Usuario autenticado"}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Configurar empresa inicial</h1>
        <div className="mt-6 grid gap-4">
          <label className="block text-sm font-medium text-slate-700">
            Nombre completo
            <input name="fullName" required defaultValue={session.profile?.fullName ?? ""} className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Empresa
            <input name="companyName" required className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Sucursal principal
            <input name="branchName" required className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
        </div>
        {params?.error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error}</p> : null}
        <button type="submit" className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Crear empresa y continuar
        </button>
      </form>
    </main>
  );
}
