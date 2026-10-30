import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[1.8rem] border border-line bg-card p-6 sm:p-8">
        <p className="text-sm text-muted">Doğuhan Erol</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Yönetim girişi</h1>
        <p className="mt-2 text-sm text-muted">
          Tek hesap. Telefondan ve başka bilgisayarlardan aynı anda açık kalabilir.
        </p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-muted">Yükleniyor…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
