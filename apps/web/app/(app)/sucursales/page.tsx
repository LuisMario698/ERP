import { requireTenantContext } from "../../../lib/auth/session";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const session = await requireTenantContext();
  const supabase = await createServerSupabaseClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, code, status, created_at")
    .eq("company_id", session.tenant.companyId)
    .order("created_at", { ascending: true });

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-slate-500">Sucursales</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{session.tenant.companyName}</h2>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sucursal</th>
              <th className="px-4 py-3 font-medium">Codigo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(branches ?? []).map((branch) => (
              <tr key={branch.id} className="border-t">
                <td className="px-4 py-3 font-medium text-slate-950">{branch.name}</td>
                <td className="px-4 py-3 text-slate-600">{branch.code ?? "Sin codigo"}</td>
                <td className="px-4 py-3 text-slate-600">{branch.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {branches?.length === 0 ? <p className="p-6 text-sm text-slate-500">No hay sucursales registradas.</p> : null}
      </div>
    </section>
  );
}
