import { CheckCircle2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { requireTenantContext } from "../../../lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireTenantContext();
  const checks = [
    { label: "Supabase URL", ready: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), icon: Database },
    { label: "Supabase anon key", ready: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), icon: ShieldCheck },
    { label: "Migracion Sprint 1", ready: true, icon: GitBranch },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-slate-500">Configuracion</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{session.tenant.companyName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <div key={check.label} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <check.icon className="h-5 w-5 text-slate-400" />
              <CheckCircle2 className={check.ready ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-300"} />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-950">{check.label}</p>
            <p className="mt-1 text-sm text-slate-600">{check.ready ? "Configurado" : "Pendiente"}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">Rollback operativo</h3>
        <p className="mt-2 text-sm text-slate-600">
          Sprint 1 queda encapsulado en migraciones versionadas y rutas aisladas. Para volver al punto anterior se revierte el commit del sprint y se aplica la migracion down asociada.
        </p>
      </div>
    </section>
  );
}
