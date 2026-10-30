"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/validators";

export const inputClass =
  "w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Notice({ state }: { state: ActionState }) {
  if (!state) return null;
  if (state.ok) return <p className="text-sm text-accent">{state.message || "Kaydedildi."}</p>;
  return <p className="text-sm text-red-600">{state.error}</p>;
}

export function SaveForm({
  action,
  children,
  submit = "Kaydet",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submit?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-4">
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : submit}
        </button>
        <Notice state={state} />
      </div>
    </form>
  );
}
