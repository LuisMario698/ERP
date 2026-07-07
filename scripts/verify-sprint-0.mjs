import { existsSync } from "node:fs";

const requiredPaths = [
  "pnpm-workspace.yaml",
  "turbo.json",
  "apps/web/package.json",
  "apps/web/app/layout.tsx",
  "apps/web/app/page.tsx",
  "apps/web/components/layout/app-shell.tsx",
  "apps/web/lib/supabase.ts",
  "apps/mobile/README.md",
  "packages/ui/src/index.tsx",
  "packages/types/src/index.ts",
  "packages/validations/src/index.ts",
  "packages/database/src/index.ts",
  "packages/auth/src/index.ts",
  "packages/utils/src/index.ts",
  "docs/SPRINT_0.md",
];

const missingPaths = requiredPaths.filter((path) => !existsSync(path));

if (missingPaths.length > 0) {
  console.error("Sprint 0 verification failed. Missing paths:");
  for (const path of missingPaths) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log("Sprint 0 verification passed. Required monorepo files are present.");
