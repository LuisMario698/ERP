# ERP/POS Web Monorepo

Base técnica del ERP/POS modular. Esta etapa corresponde al **Sprint 0**: preparar el monorepo, la aplicación web principal y los paquetes compartidos antes de construir módulos funcionales como POS, inventario o ventas.

## Stack inicial

- Turborepo + pnpm workspaces
- Next.js + React + TypeScript
- Tailwind CSS con base compatible con shadcn/ui
- Supabase/PostgreSQL preparado mediante variables de entorno
- Paquetes compartidos para UI, tipos, validaciones, database, auth y utils

## Estructura

```txt
apps/
  web/       Aplicación principal ERP/POS PWA en Next.js.
  mobile/    Espacio reservado para futuros módulos Expo React Native.
packages/
  auth/        Roles y helpers de autenticación/autorización.
  database/    Configuración y decisión ORM para Supabase/PostgreSQL.
  types/       Tipos compartidos.
  ui/          Componentes visuales reutilizables.
  utils/       Utilidades compartidas.
  validations/ Esquemas Zod compartidos.
```

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa las credenciales reales de Supabase/PostgreSQL antes de conectar servicios externos.

## Alcance actual

Incluido:

- Monorepo inicial.
- App web base con layout, sidebar, header y área de contenido.
- Tailwind CSS y configuración visual inicial.
- Preparación para Supabase y PostgreSQL.
- Decisión inicial de ORM: Drizzle.
- Paquetes compartidos base.

No incluido todavía:

- POS.
- Ventas.
- Inventario avanzado.
- Reportes.
- App móvil funcional.
- Inteligencia artificial.
