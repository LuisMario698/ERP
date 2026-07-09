import { requireTenantContext } from "../../../lib/auth/session";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const session = await requireTenantContext();
  const supabase = await createServerSupabaseClient();
  const [{ data: company }, { count: branchesCount }, { count: membersCount }] = await Promise.all([
    supabase.from("companies").select("id, name, tax_id, status, created_at").eq("id", session.tenant.companyId).maybeSingle(),
    supabase.from("branches").select("id", { count: "exact", head: true }).eq("company_id", session.tenant.companyId),
    supabase.from("user_company_memberships").select("user_id", { count: "exact", head: true }).eq("company_id", session.tenant.companyId),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-slate-500">Empresas</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{company?.name ?? session.tenant.companyName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Estado</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">{company?.status ?? "active"}</p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Sucursales</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">{branchesCount ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Usuarios</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">{membersCount ?? 0}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">Datos fiscales</h3>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">RFC / Tax ID</dt>
            <dd className="mt-1 text-sm font-medium text-slate-950">{company?.tax_id ?? "Sin capturar"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Rol actual</dt>
            <dd className="mt-1 text-sm font-medium text-slate-950">{session.tenant.roleName}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
