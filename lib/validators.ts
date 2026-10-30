import { z } from "zod";

const text = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `En az ${min} karakter.`)
    .max(max, `En fazla ${max} karakter.`);

export const profileSchema = z.object({
  name: text(2, 80),
  roleTr: text(2, 80),
  roleEn: text(2, 80),
  headlineBeforeTr: text(2, 120),
  headlineAccentTr: text(2, 120),
  headlineBeforeEn: text(2, 160),
  headlineAccentEn: text(2, 160),
  leadTr: text(10, 600),
  leadEn: text(10, 600),
  aboutTr: text(10, 4000),
  aboutEn: text(10, 4000),
  locationTr: text(2, 80),
  locationEn: text(2, 80),
  availabilityTr: text(2, 200),
  availabilityEn: text(2, 200),
  stack: text(2, 400),
  email: z.string().trim().max(120),
  whatsapp: z.string().trim().max(32),
  telegram: z.string().trim().max(32),
  github: z.string().trim().max(200),
});

export const projectSchema = z.object({
  title: text(2, 120),
  slug: z
    .string()
    .trim()
    .min(2, "Kısa adres en az 2 karakter.")
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Kısa adres küçük harf, rakam ve tire olmalı."),
  sortOrder: z.coerce.number().int().min(0).max(999),
  published: z.boolean(),
  kickerTr: text(2, 120),
  kickerEn: text(2, 120),
  summaryTr: text(10, 800),
  summaryEn: text(10, 800),
  pointsTr: text(2, 2000),
  pointsEn: text(2, 2000),
  url: z.string().trim().url("Geçerli bir bağlantı girin."),
  urlLabel: text(2, 80),
  url2: z.string().trim().max(300),
  urlLabel2: z.string().trim().max(80),
  tags: text(2, 200),
  tone: z.enum(["qrivo", "scp", "generic"]),
}).superRefine((value, ctx) => {
  if (!value.url2 && !value.urlLabel2) return;
  if (!value.url2 || !value.urlLabel2) {
    ctx.addIssue({
      code: "custom",
      path: ["url2"],
      message: "İkinci örnek için adres ve yazı birlikte girilmeli.",
    });
    return;
  }
  try {
    const parsed = new URL(value.url2);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("protocol");
  } catch {
    ctx.addIssue({
      code: "custom",
      path: ["url2"],
      message: "İkinci bağlantı geçerli bir adres olmalı.",
    });
  }
});

export const skillSchema = z.object({
  sortOrder: z.coerce.number().int().min(0).max(999),
  published: z.boolean(),
  titleTr: text(2, 80),
  titleEn: text(2, 80),
  bodyTr: text(10, 500),
  bodyEn: text(10, 500),
});

export const contactSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  message: text(5, 4000),
});

export type ActionState = { ok: true; message?: string } | { ok: false; error: string } | null;

export function firstZodError(error: z.ZodError): string {
  return error.issues[0]?.message || "Formu kontrol edin.";
}

export function readBool(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}
