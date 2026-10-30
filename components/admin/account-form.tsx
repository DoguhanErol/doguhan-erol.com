"use client";

import { updateAccount } from "@/lib/actions/account";
import { Field, inputClass, SaveForm } from "./fields";

export function AccountForm({ username, email }: { username: string; email: string }) {
  return (
    <section className="max-w-xl rounded-3xl border border-line bg-card p-5">
      <h2 className="text-lg font-semibold">Giriş bilgisi</h2>
      <p className="mt-1 text-sm text-muted">
        Aynı hesap telefondan ve başka bilgisayarlardan açık kalabilir. Çıkış yalnızca bu cihazı kapatır.
        Şifreyi değiştirmek diğer açık oturumları düşürmez.
      </p>
      <div className="mt-5">
        <SaveForm action={updateAccount}>
          <Field label="Kullanıcı adı">
            <input name="username" defaultValue={username} className={inputClass} required />
          </Field>
          <Field label="E-posta">
            <input name="email" type="email" defaultValue={email} className={inputClass} required />
          </Field>
          <Field label="Mevcut şifre">
            <input name="currentPassword" type="password" autoComplete="current-password" className={inputClass} required />
          </Field>
          <Field label="Yeni şifre (boşsa değişmez)">
            <input name="newPassword" type="password" autoComplete="new-password" className={inputClass} />
          </Field>
        </SaveForm>
      </div>
    </section>
  );
}
