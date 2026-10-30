"use client";

import { deleteSkill, saveSkill } from "@/lib/actions/content";
import { Field, inputClass, SaveForm } from "./fields";

export type SkillFormValues = {
  id?: string;
  sortOrder: number;
  published: boolean;
  titleTr: string;
  titleEn: string;
  bodyTr: string;
  bodyEn: string;
};

function SkillForm({ skill }: { skill: SkillFormValues }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{skill.id ? skill.titleTr : "Yeni yetenek"}</h2>
        {skill.id ? (
          <form action={deleteSkill}>
            <input type="hidden" name="id" value={skill.id} />
            <button
              type="submit"
              className="text-sm text-red-600"
              onClick={(event) => {
                if (!confirm("Bu yetenek silinsin mi?")) event.preventDefault();
              }}
            >
              Sil
            </button>
          </form>
        ) : null}
      </div>
      <SaveForm action={saveSkill} submit={skill.id ? "Kaydet" : "Ekle"}>
        {skill.id ? <input type="hidden" name="id" value={skill.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Başlık (TR)">
            <input name="titleTr" defaultValue={skill.titleTr} className={inputClass} required />
          </Field>
          <Field label="Başlık (EN)">
            <input name="titleEn" defaultValue={skill.titleEn} className={inputClass} required />
          </Field>
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={skill.sortOrder} className={inputClass} />
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input name="published" type="checkbox" defaultChecked={skill.published} className="size-4" />
            Yayında
          </label>
        </div>
        <Field label="Metin (TR)">
          <textarea name="bodyTr" defaultValue={skill.bodyTr} rows={3} className={inputClass} required />
        </Field>
        <Field label="Metin (EN)">
          <textarea name="bodyEn" defaultValue={skill.bodyEn} rows={3} className={inputClass} required />
        </Field>
      </SaveForm>
    </section>
  );
}

export function SkillsManager({ skills }: { skills: SkillFormValues[] }) {
  return (
    <div className="space-y-6">
      {skills.map((skill) => (
        <SkillForm key={skill.id} skill={skill} />
      ))}
      <SkillForm
        skill={{
          sortOrder: skills.length,
          published: true,
          titleTr: "",
          titleEn: "",
          bodyTr: "",
          bodyEn: "",
        }}
      />
    </div>
  );
}
