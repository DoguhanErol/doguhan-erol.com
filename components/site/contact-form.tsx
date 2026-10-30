"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions/contact";

type Copy = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  error: string;
  rate: string;
};

export function ContactForm({ copy }: { copy: Copy }) {
  const [state, action, pending] = useActionState(sendMessage, null);
  const error =
    state && !state.ok ? (state.error === "rate" ? copy.rate : copy.error) : null;

  if (state?.ok) {
    return (
      <p className="rounded-2xl border border-line bg-chip px-4 py-5 text-sm" role="status">
        {copy.sent}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm">
          {copy.name}
        </label>
        <input
          id="name"
          name="name"
          placeholder={copy.namePlaceholder}
          className="h-12 w-full rounded-2xl border border-line bg-chip px-4 text-sm outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm">
          {copy.email} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={copy.emailPlaceholder}
          className="h-12 w-full rounded-2xl border border-line bg-chip px-4 text-sm outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm">
          {copy.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={5}
          placeholder={copy.messagePlaceholder}
          className="w-full rounded-2xl border border-line bg-chip px-4 py-3 text-sm outline-none"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper disabled:opacity-60"
      >
        {pending ? copy.sending : copy.send}
      </button>
    </form>
  );
}
