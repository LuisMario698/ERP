# Sprint 1 - Base operativa escalable

## Objetivo

Convertir la base tecnica del Sprint 0 en una aplicacion operativa con autenticacion, multiempresa, sucursales, perfiles y roles iniciales, sin construir todavia POS, ventas o inventario avanzado.

## Entregables implementados

- Limpieza de Git para no versionar artefactos generados por Next.js, Turbo o TypeScript.
- Configuracion explicita de `pnpm` para builds permitidos de dependencias nativas.
- Tipos compartidos para empresa, sucursal, perfil, rol y contexto activo de tenant.
- Validaciones Zod para empresa, sucursal, perfil y onboarding.
- Schema Drizzle para Supabase/PostgreSQL.
- Migracion reversible con archivos `up` y `down`.
- Supabase Auth con email/password como flujo inicial.
- Rutas web:
  - `/login`
  - `/registro`
  - `/onboarding`
  - `/`
  - `/empresas`
  - `/sucursales`
  - `/permisos`
  - `/configuracion`
- Layout autenticado que exige usuario y contexto activo de empresa/sucursal desde Server Components.
- Funcion RPC `create_company_onboarding` para crear perfil, empresa, sucursal principal y membresia de administrador en una sola operacion.

## Decisiones tecnicas

- La app funcional sigue viviendo en `apps/web`.
- La app movil sigue reservada en `apps/mobile`.
- La base de datos objetivo es Supabase/PostgreSQL.
- El ORM seleccionado es Drizzle.
- La separacion por dominios queda reforzada:
  - `@erp/types` define contratos.
  - `@erp/validations` valida entradas.
  - `@erp/database` define schema y migraciones.
  - `@erp/auth` centraliza roles y decisiones de sesion.
  - `apps/web` consume esas capas para la experiencia web.

## Escalabilidad

- Todo modulo futuro debe operar con `companyId` y, cuando aplique, `branchId`.
- Los roles iniciales quedan sembrados desde la migracion, aunque Sprint 1 solo aplica control administrativo basico.
- Las tablas usan UUIDs, timestamps y estados para permitir auditoria y desactivacion logica.
- Las caracteristicas se agregan por rutas y dominios aislados para facilitar rollback por commit o migracion.

## Rollback

Para volver atras este sprint:

1. Revertir el commit del Sprint 1.
2. Aplicar `packages/database/migrations/0001_sprint_1_base_operativa.down.sql` en Supabase/PostgreSQL.
3. Mantener intacta la base documentada en `docs/SPRINT_0.md`.

## No incluido en este sprint

- POS.
- Ventas.
- Caja.
- Inventario avanzado.
- Reportes.
- App movil funcional.
- IA.

## Verificacion

Ejecuta desde la raiz del repositorio:

```bash
pnpm install
pnpm verify:sprint0
pnpm verify:sprint1
pnpm lint
pnpm typecheck
pnpm build
```

## Criterios de terminado

- El repo no muestra outputs generados como cambios pendientes despues de compilar.
- `pnpm verify:sprint0` y `pnpm verify:sprint1` pasan.
- `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan.
- Un usuario autenticado puede completar onboarding y entrar al dashboard con empresa/sucursal activa.
