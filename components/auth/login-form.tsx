"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    const code = (result as { code?: string } | null)?.code;
    if (result?.error) {
      setLoading(false);
      setError(
        code === "RATE_LIMITED"
          ? "Çok fazla deneme. Biraz sonra tekrar girin."
          : "Kullanıcı adı veya şifre yanlış."
      );
      return;
    }

    const callback = params.get("callbackUrl") || "/admin";
    window.location.href = callback.startsWith("/admin") ? callback : "/admin";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Kullanıcı adı veya e-posta</span>
        <input
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          autoComplete="username"
          required
          className="h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Şifre</span>
        <span className="relative block">
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-2xl border border-line bg-paper px-4 pr-12 text-sm outline-none"
          />
          <button
            type="button"
            aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            onClick={() => setShow((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Giriş yap
      </button>
    </form>
  );
}
