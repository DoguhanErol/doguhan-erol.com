"use client";

import { deleteProject, saveProject } from "@/lib/actions/content";
import { Field, inputClass, SaveForm } from "./fields";

export type ProjectFormValues = {
  id?: string;
  title: string;
  slug: string;
  sortOrder: number;
  published: boolean;
  kickerTr: string;
  kickerEn: string;
  summaryTr: string;
  summaryEn: string;
  pointsTr: string;
  pointsEn: string;
  url: string;
  urlLabel: string;
  url2?: string;
  urlLabel2?: string;
  tags: string;
  tone: string;
};

const empty: ProjectFormValues = {
  title: "",
  slug: "",
  sortOrder: 10,
  published: true,
  kickerTr: "",
  kickerEn: "",
  summaryTr: "",
  summaryEn: "",
  pointsTr: "",
  pointsEn: "",
  url: "https://",
  urlLabel: "",
  url2: "",
  urlLabel2: "",
  tags: "",
  tone: "generic",
};

function ProjectForm({ project }: { project: ProjectFormValues }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{project.id ? project.title : "Yeni proje"}</h2>
        {project.id ? (
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <button
              type="submit"
              className="text-sm text-red-600"
              onClick={(event) => {
                if (!confirm("Bu proje silinsin mi?")) event.preventDefault();
              }}
            >
              Sil
            </button>
          </form>
        ) : null}
      </div>
      <SaveForm action={saveProject} submit={project.id ? "Kaydet" : "Ekle"}>
        {project.id ? <input type="hidden" name="id" value={project.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Başlık">
            <input name="title" defaultValue={project.title} className={inputClass} required />
          </Field>
          <Field label="Kısa adres">
            <input name="slug" defaultValue={project.slug} className={inputClass} placeholder="otomatik" />
          </Field>
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={project.sortOrder} className={inputClass} />
          </Field>
          <Field label="Görünüm">
            <select name="tone" defaultValue={project.tone} className={inputClass}>
              <option value="qrivo">Qrivo telefonu</option>
              <option value="scp">SCP terminali</option>
              <option value="generic">Düz pencere</option>
            </select>
          </Field>
          <Field label="Üst yazı (TR)">
            <input name="kickerTr" defaultValue={project.kickerTr} className={inputClass} required />
          </Field>
          <Field label="Üst yazı (EN)">
            <input name="kickerEn" defaultValue={project.kickerEn} className={inputClass} required />
          </Field>
          <Field label="Bağlantı">
            <input name="url" defaultValue={project.url} className={inputClass} required />
          </Field>
          <Field label="Bağlantı yazısı">
            <input name="urlLabel" defaultValue={project.urlLabel} className={inputClass} required />
          </Field>
          <Field label="İkinci örnek">
            <input name="url2" defaultValue={project.url2 || ""} className={inputClass} placeholder="https://" />
          </Field>
          <Field label="İkinci örnek yazısı">
            <input name="urlLabel2" defaultValue={project.urlLabel2 || ""} className={inputClass} placeholder="İsteğe bağlı" />
          </Field>
          <Field label="Etiketler (virgülle)">
            <input name="tags" defaultValue={project.tags} className={inputClass} required />
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input name="published" type="checkbox" defaultChecked={project.published} className="size-4" />
            Yayında
          </label>
        </div>
        <Field label="Özet (TR)">
          <textarea name="summaryTr" defaultValue={project.summaryTr} rows={3} className={inputClass} required />
        </Field>
        <Field label="Özet (EN)">
          <textarea name="summaryEn" defaultValue={project.summaryEn} rows={3} className={inputClass} required />
        </Field>
        <Field label="Maddeler (TR, satır satır)">
          <textarea name="pointsTr" defaultValue={project.pointsTr} rows={4} className={inputClass} required />
        </Field>
        <Field label="Maddeler (EN, satır satır)">
          <textarea name="pointsEn" defaultValue={project.pointsEn} rows={4} className={inputClass} required />
        </Field>
      </SaveForm>
    </section>
  );
}

export function ProjectsManager({ projects }: { projects: ProjectFormValues[] }) {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectForm key={project.id} project={project} />
      ))}
      <ProjectForm project={empty} />
    </div>
  );
}
