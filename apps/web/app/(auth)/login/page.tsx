"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function signIn(form: HTMLFormElement) {
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    let signInError: Error | null = null;

    try {
      const supabase = createBrowserSupabaseClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      signInError = result.error;
    } catch (clientError) {
      signInError = clientError instanceof Error ? clientError : new Error("No se pudo iniciar Supabase.");
    }

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(() => {
      void signIn(event.currentTarget);
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-slate-500">ERP/POS</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Iniciar sesion</h1>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Correo
            <input name="email" type="email" required className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Contrasena
            <input name="password" type="password" required className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={isPending} className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {isPending ? "Entrando..." : "Entrar"}
        </button>
        <a href="/registro" className="mt-4 block text-center text-sm font-medium text-primary">
          Crear cuenta
        </a>
      </form>
    </main>
  );
}
