const sprintZeroItems = [
  "Monorepo con Turborepo y pnpm",
  "Next.js, React, TypeScript y Tailwind CSS",
  "Estructura preparada para Supabase y PostgreSQL",
  "Paquetes compartidos para UI, tipos, validaciones, database, auth y utils",
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">ERP/POS modular</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Base técnica para crecer por sprints</h2>
        <p className="mt-4 max-w-3xl text-slate-600">
          Esta primera base prioriza una arquitectura limpia antes de desarrollar POS, ventas o inventario avanzado.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sprintZeroItems.map((item) => (
          <div key={item} className="rounded-xl border bg-white p-5 text-sm font-medium text-slate-700 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
