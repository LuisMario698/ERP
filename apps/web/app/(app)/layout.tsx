import { AppShell } from "../../components/layout/app-shell";
import { requireTenantContext } from "../../lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireTenantContext();

  return (
    <AppShell profileName={session.profile.fullName} tenant={session.tenant}>
      {children}
    </AppShell>
  );
}
