import { requireTenantContext } from "../../../lib/auth/session";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function firstProfile(value: { full_name?: string; email?: string } | { full_name?: string; email?: string }[] | null | undefined) {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function firstRoleName(value: { name?: string } | { name?: string }[] | null | undefined) {
  return Array.isArray(value) ? value[0]?.name : value?.name;
}

export default async function PermissionsPage() {
  const session = await requireTenantContext();
  const supabase = await createServerSupabaseClient();
  const [{ data: roles }, { data: memberships }] = await Promise.all([
    supabase.from("roles").select("id, name, description").order("name"),
    supabase
      .from("user_company_memberships")
      .select("status, profiles(full_name, email), roles(name)")
      .eq("company_id", session.tenant.companyId)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-slate-500">Permisos</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Roles y usuarios</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {(roles ?? []).map((role) => (
          <div key={role.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">{role.name}</p>
            <p className="mt-2 text-sm text-slate-600">{role.description ?? "Sin descripcion"}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(memberships ?? []).map((membership, index) => (
              <tr key={`${firstProfile(membership.profiles)?.email ?? "member"}-${index}`} className="border-t">
                <td className="px-4 py-3 font-medium text-slate-950">{firstProfile(membership.profiles)?.full_name ?? "Sin perfil"}</td>
                <td className="px-4 py-3 text-slate-600">{firstProfile(membership.profiles)?.email ?? "Sin correo"}</td>
                <td className="px-4 py-3 text-slate-600">{firstRoleName(membership.roles) ?? "Sin rol"}</td>
                <td className="px-4 py-3 text-slate-600">{membership.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {memberships?.length === 0 ? <p className="p-6 text-sm text-slate-500">No hay usuarios vinculados.</p> : null}
      </div>
    </section>
  );
}
