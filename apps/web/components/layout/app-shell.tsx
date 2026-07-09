import type { TenantContext } from "@erp/types";
import { Building2, Home, LogOut, Package, Settings, ShieldCheck } from "lucide-react";
import { signOutAction } from "../../app/actions/auth";

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Empresas", href: "/empresas", icon: Building2 },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Permisos", href: "/permisos", icon: ShieldCheck },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

interface AppShellProps {
  children: React.ReactNode;
  profileName: string;
  tenant: TenantContext;
}

export function AppShell({ children, profileName, tenant }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white p-6 lg:block">
        <div className="text-xl font-bold text-slate-950">ERP/POS</div>
        <p className="mt-1 text-sm text-slate-500">{tenant.companyName}</p>
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <item.icon className="h-4 w-4" />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {tenant.companyName} / {tenant.branchName}
              </p>
              <h1 className="text-lg font-semibold text-slate-950">Panel principal</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-950">{profileName}</p>
                <p className="text-xs text-slate-500">{tenant.roleName}</p>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-slate-600 hover:bg-slate-100"
                  title="Cerrar sesion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
