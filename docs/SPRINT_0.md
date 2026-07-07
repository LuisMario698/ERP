# Sprint 0 - Base técnica del ERP/POS

Este documento existe fuera del `README.md` para que la documentación principal del Sprint 0 no se pierda si el README tiene conflictos al aplicar cambios en otra copia del repositorio.

## Objetivo

Preparar la estructura inicial antes de desarrollar módulos funcionales como POS, ventas, inventario avanzado o reportes.

## Entregables implementados

- Monorepo con Turborepo y pnpm workspaces.
- Aplicación web principal en `apps/web` usando Next.js, React y TypeScript.
- Tailwind CSS configurado para la interfaz inicial.
- Base visual con sidebar, header, área de contenido y navegación.
- Variables de entorno de ejemplo para Supabase/PostgreSQL.
- Paquetes compartidos iniciales:
  - `packages/ui`
  - `packages/types`
  - `packages/validations`
  - `packages/database`
  - `packages/auth`
  - `packages/utils`
- Carpeta `apps/mobile` reservada para módulos Expo React Native futuros, sin implementación funcional todavía.

## Decisiones técnicas iniciales

- La primera aplicación funcional será web/PWA en `apps/web`.
- La base de datos objetivo es Supabase/PostgreSQL.
- La decisión inicial de ORM queda registrada como Drizzle en `packages/database`.
- La lógica compartida debe vivir en paquetes reutilizables para facilitar futuros módulos móviles o de escritorio.

## No incluido en este sprint

- POS.
- Ventas.
- Inventario avanzado.
- Caja.
- Reportes.
- App móvil funcional.
- Inteligencia artificial.

## Verificación rápida

Ejecuta los siguientes comandos desde la raíz del repositorio:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm verify:sprint0
```
