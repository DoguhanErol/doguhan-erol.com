"use client";

import { useActionState } from "react";
import { removePortrait, updateProfile, uploadPortrait } from "@/lib/actions/content";
import { Field, inputClass, Notice, SaveForm } from "./fields";

type Profile = {
  name: string;
  roleTr: string;
  roleEn: string;
  headlineBeforeTr: string;
  headlineAccentTr: string;
  headlineBeforeEn: string;
  headlineAccentEn: string;
  leadTr: string;
  leadEn: string;
  aboutTr: string;
  aboutEn: string;
  locationTr: string;
  locationEn: string;
  availabilityTr: string;
  availabilityEn: string;
  stack: string;
  email: string;
  whatsapp: string;
  telegram: string;
  github: string;
  portraitUrl: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadPortrait, null);
  const [removeState, removeAction, removePending] = useActionState(removePortrait, null);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">Fotoğraf</h2>
        <p className="mt-1 text-sm text-muted">Hakkımda bölümünde görünür. Boşsa baş harfler durur.</p>
        {profile.portraitUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.portraitUrl} alt="" className="mt-4 size-28 rounded-2xl object-cover" />
        ) : null}
        <form action={uploadAction} className="mt-4 flex flex-wrap items-center gap-3">
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
          <button
            type="submit"
            disabled={uploadPending}
            className="h-10 rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
          >
            {uploadPending ? "Yükleniyor…" : "Yükle"}
          </button>
          <Notice state={uploadState} />
        </form>
        {profile.portraitUrl ? (
          <form action={removeAction} className="mt-3 flex items-center gap-3">
            <button type="submit" disabled={removePending} className="text-sm text-red-600">
              Fotoğrafı kaldır
            </button>
            <Notice state={removeState} />
          </form>
        ) : null}
      </section>

      <section className="rounded-3xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">İletişim ve vitrin</h2>
        <div className="mt-5">
          <SaveForm action={updateProfile}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Ad">
                <input name="name" defaultValue={profile.name} className={inputClass} required />
              </Field>
              <Field label="Yığın (nokta veya virgülle)">
                <input name="stack" defaultValue={profile.stack} className={inputClass} required />
              </Field>
              <Field label="E-posta">
                <input name="email" defaultValue={profile.email} className={inputClass} placeholder="sen@doguhan-erol.com" />
              </Field>
              <Field label="WhatsApp (905xxxxxxxxx)">
                <input name="whatsapp" defaultValue={profile.whatsapp} className={inputClass} />
              </Field>
              <Field label="Telegram kullanıcı adı">
                <input name="telegram" defaultValue={profile.telegram} className={inputClass} placeholder="kullanici" />
              </Field>
              <Field label="GitHub">
                <input name="github" defaultValue={profile.github} className={inputClass} />
              </Field>
              <Field label="Rol (TR)">
                <input name="roleTr" defaultValue={profile.roleTr} className={inputClass} required />
              </Field>
              <Field label="Rol (EN)">
                <input name="roleEn" defaultValue={profile.roleEn} className={inputClass} required />
              </Field>
              <Field label="Başlık, ilk satır (TR)">
                <input name="headlineBeforeTr" defaultValue={profile.headlineBeforeTr} className={inputClass} required />
              </Field>
              <Field label="Başlık, mavi satır (TR)">
                <input name="headlineAccentTr" defaultValue={profile.headlineAccentTr} className={inputClass} required />
              </Field>
              <Field label="Başlık, ilk satır (EN)">
                <input name="headlineBeforeEn" defaultValue={profile.headlineBeforeEn} className={inputClass} required />
              </Field>
              <Field label="Başlık, mavi satır (EN)">
                <input name="headlineAccentEn" defaultValue={profile.headlineAccentEn} className={inputClass} required />
              </Field>
              <Field label="Konum (TR)">
                <input name="locationTr" defaultValue={profile.locationTr} className={inputClass} required />
              </Field>
              <Field label="Konum (EN)">
                <input name="locationEn" defaultValue={profile.locationEn} className={inputClass} required />
              </Field>
              <Field label="Müsaitlik (TR)">
                <input name="availabilityTr" defaultValue={profile.availabilityTr} className={inputClass} required />
              </Field>
              <Field label="Müsaitlik (EN)">
                <input name="availabilityEn" defaultValue={profile.availabilityEn} className={inputClass} required />
              </Field>
            </div>
            <Field label="Kısa giriş (TR)">
              <textarea name="leadTr" defaultValue={profile.leadTr} rows={3} className={inputClass} required />
            </Field>
            <Field label="Kısa giriş (EN)">
              <textarea name="leadEn" defaultValue={profile.leadEn} rows={3} className={inputClass} required />
            </Field>
            <Field label="Hakkımda (TR)">
              <textarea name="aboutTr" defaultValue={profile.aboutTr} rows={7} className={inputClass} required />
            </Field>
            <Field label="Hakkımda (EN)">
              <textarea name="aboutEn" defaultValue={profile.aboutEn} rows={7} className={inputClass} required />
            </Field>
          </SaveForm>
        </div>
      </section>
    </div>
  );
}
