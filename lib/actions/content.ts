"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { requireAdmin } from "@/lib/actions/guard";
import { prisma } from "@/lib/db";
import { deleteFromMinio, ensureBucket, extractKeyFromUrl, uploadToMinio } from "@/lib/minio";
import { slugify } from "@/lib/utils";
import {
  firstZodError,
  profileSchema,
  projectSchema,
  readBool,
  skillSchema,
  type ActionState,
} from "@/lib/validators";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/skills");
}

async function denied(): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Oturum kapandı. Tekrar girin." };
  return null;
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await denied();
  if (blocked) return blocked;

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    roleTr: formData.get("roleTr"),
    roleEn: formData.get("roleEn"),
    headlineBeforeTr: formData.get("headlineBeforeTr"),
    headlineAccentTr: formData.get("headlineAccentTr"),
    headlineBeforeEn: formData.get("headlineBeforeEn"),
    headlineAccentEn: formData.get("headlineAccentEn"),
    leadTr: formData.get("leadTr"),
    leadEn: formData.get("leadEn"),
    aboutTr: formData.get("aboutTr"),
    aboutEn: formData.get("aboutEn"),
    locationTr: formData.get("locationTr"),
    locationEn: formData.get("locationEn"),
    availabilityTr: formData.get("availabilityTr"),
    availabilityEn: formData.get("availabilityEn"),
    stack: formData.get("stack"),
    email: formData.get("email") || "",
    whatsapp: formData.get("whatsapp") || "",
    telegram: String(formData.get("telegram") || "").replace(/^@+/, ""),
    github: formData.get("github") || "",
  });

  if (!parsed.success) return { ok: false, error: firstZodError(parsed.error) };

  if (parsed.data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.data.email)) {
    return { ok: false, error: "E-posta geçerli değil." };
  }
  if (parsed.data.github && !/^https?:\/\//.test(parsed.data.github)) {
    return { ok: false, error: "GitHub adresi http ile başlamalı." };
  }

  await prisma.profile.update({
    where: { id: "main" },
    data: parsed.data,
  });
  refresh();
  return { ok: true, message: "Profil kaydedildi." };
}

export async function uploadPortrait(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await denied();
  if (blocked) return blocked;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Bir görsel seçin." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Görsel 8 MB'dan küçük olmalı." };
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(input)
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await ensureBucket();
    const url = await uploadToMinio("profile/portrait.webp", webp, "image/webp");
    await prisma.profile.update({
      where: { id: "main" },
      data: { portraitUrl: url },
    });
  } catch {
    return { ok: false, error: "Görsel işlenemedi. JPG, PNG veya WebP deneyin." };
  }

  refresh();
  return { ok: true, message: "Fotoğraf güncellendi." };
}

export async function removePortrait(
  _prev: ActionState,
  _formData: FormData
): Promise<ActionState> {
  const blocked = await denied();
  if (blocked) return blocked;

  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  const key = extractKeyFromUrl(profile?.portraitUrl);
  if (key) await deleteFromMinio(key);
  await prisma.profile.update({
    where: { id: "main" },
    data: { portraitUrl: null },
  });
  refresh();
  return { ok: true, message: "Fotoğraf kaldırıldı." };
}

function projectInput(formData: FormData) {
  const title = String(formData.get("title") || "");
  const slugRaw = String(formData.get("slug") || "");
  return {
    title,
    slug: slugify(slugRaw || title),
    sortOrder: formData.get("sortOrder") || "0",
    published: readBool(formData, "published"),
    kickerTr: formData.get("kickerTr"),
    kickerEn: formData.get("kickerEn"),
    summaryTr: formData.get("summaryTr"),
    summaryEn: formData.get("summaryEn"),
    pointsTr: formData.get("pointsTr"),
    pointsEn: formData.get("pointsEn"),
    url: formData.get("url"),
    urlLabel: formData.get("urlLabel"),
    url2: formData.get("url2") || "",
    urlLabel2: formData.get("urlLabel2") || "",
    tags: formData.get("tags"),
    tone: formData.get("tone") || "generic",
  };
}

export async function saveProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await denied();
  if (blocked) return blocked;

  const id = String(formData.get("id") || "");
  const parsed = projectSchema.safeParse(projectInput(formData));
  if (!parsed.success) return { ok: false, error: firstZodError(parsed.error) };

  const clash = await prisma.project.findFirst({
    where: {
      slug: parsed.data.slug,
      ...(id ? { NOT: { id } } : {}),
    },
  });
  if (clash) return { ok: false, error: "Bu kısa adres kullanılıyor." };

  if (id) {
    await prisma.project.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.project.create({ data: parsed.data });
  }

  refresh();
  return { ok: true, message: id ? "Proje kaydedildi." : "Proje eklendi." };
}

export async function deleteProject(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.project.delete({ where: { id } });
  refresh();
}

function skillInput(formData: FormData) {
  return {
    sortOrder: formData.get("sortOrder") || "0",
    published: readBool(formData, "published"),
    titleTr: formData.get("titleTr"),
    titleEn: formData.get("titleEn"),
    bodyTr: formData.get("bodyTr"),
    bodyEn: formData.get("bodyEn"),
  };
}

export async function saveSkill(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await denied();
  if (blocked) return blocked;

  const id = String(formData.get("id") || "");
  const parsed = skillSchema.safeParse(skillInput(formData));
  if (!parsed.success) return { ok: false, error: firstZodError(parsed.error) };

  if (id) {
    await prisma.skill.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.skill.create({ data: parsed.data });
  }
  refresh();
  return { ok: true, message: id ? "Yetenek kaydedildi." : "Yetenek eklendi." };
}

export async function deleteSkill(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.skill.delete({ where: { id } });
  refresh();
}
