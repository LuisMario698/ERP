import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/.next/**", "**/dist/**", "**/node_modules/**", "**/next-env.d.ts"] },
  {
    plugins: { "@next/next": nextPlugin },
    settings: { next: { rootDir: ["apps/web/"] } },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    rules: { ...nextPlugin.configs.recommended.rules, ...nextPlugin.configs["core-web-vitals"].rules },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser, ...globals.node },
    },
  }
);
