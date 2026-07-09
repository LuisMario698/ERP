import { existsSync } from "node:fs";

const requiredPaths = [
  "docs/SPRINT_1.md",
  "apps/web/app/(auth)/login/page.tsx",
  "apps/web/app/(auth)/registro/page.tsx",
  "apps/web/app/onboarding/page.tsx",
  "apps/web/app/actions/onboarding.ts",
  "apps/web/app/(app)/layout.tsx",
  "apps/web/app/(app)/page.tsx",
  "apps/web/app/(app)/empresas/page.tsx",
  "apps/web/app/(app)/sucursales/page.tsx",
  "apps/web/app/(app)/permisos/page.tsx",
  "apps/web/app/(app)/configuracion/page.tsx",
  "apps/web/lib/auth/session.ts",
  "apps/web/lib/supabase/server.ts",
  "packages/types/src/index.ts",
  "packages/validations/src/index.ts",
  "packages/auth/src/index.ts",
  "packages/database/src/index.ts",
  "packages/database/migrations/0001_sprint_1_base_operativa.up.sql",
  "packages/database/migrations/0001_sprint_1_base_operativa.down.sql",
  "packages/database/migrations/0002_fix_onboarding_rpc_return_names.up.sql",
  "packages/database/migrations/0002_fix_onboarding_rpc_return_names.down.sql",
  "packages/database/migrations/0003_make_onboarding_idempotent.up.sql",
  "packages/database/migrations/0003_make_onboarding_idempotent.down.sql",
];

const missingPaths = requiredPaths.filter((path) => !existsSync(path));

if (missingPaths.length > 0) {
  console.error("Sprint 1 verification failed. Missing paths:");
  for (const path of missingPaths) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log("Sprint 1 verification passed. Auth, tenant, schema and rollback files are present.");
