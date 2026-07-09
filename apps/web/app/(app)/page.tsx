import { Building2, GitBranch, ShieldCheck, Users } from "lucide-react";
import { getOperationalOverview, requireTenantContext } from "../../lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireTenantContext();
  const overview = await getOperationalOverview(session.tenant.companyId);

  const metrics = [
    { label: "Empresa activa", value: session.tenant.companyName, icon: Building2 },
    { label: "Sucursal activa", value: session.tenant.branchName, icon: GitBranch },
    { label: "Usuarios vinculados", value: String(overview.membersCount), icon: Users },
    { label: "Roles disponibles", value: String(overview.rolesCount), icon: ShieldCheck },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase text-slate-500">Sprint 1</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Base operativa multiempresa</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Autenticacion, empresa, sucursal y permisos iniciales listos para conectar productos, inventario y POS en sprints posteriores.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <metric.icon className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-950">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">Estado de arquitectura</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium text-slate-950">Tenant activo</p>
            <p className="mt-1 text-sm text-slate-600">Toda operacion queda anclada a empresa y sucursal.</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium text-slate-950">Base versionada</p>
            <p className="mt-1 text-sm text-slate-600">Las migraciones tienen archivo de subida y reversa.</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium text-slate-950">Permisos preparados</p>
            <p className="mt-1 text-sm text-slate-600">Administrador queda activo; los demas roles ya existen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
