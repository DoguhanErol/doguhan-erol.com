import { prisma } from "./db";
import type { SiteLocale } from "./locale";
import { resolvePublicMediaUrl } from "./media-url";
import { splitLines, splitStack, splitTags } from "./utils";

export async function getProfile() {
  return prisma.profile.findUnique({ where: { id: "main" } });
}

export async function getPublicContent(locale: SiteLocale) {
  const [profile, projects, skills] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    }),
    prisma.skill.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { titleTr: "asc" }],
    }),
  ]);

  if (!profile) return null;

  const tr = locale === "tr";
  const portrait = resolvePublicMediaUrl(profile.portraitUrl);

  return {
    name: profile.name,
    role: tr ? profile.roleTr : profile.roleEn,
    headlineBefore: tr ? profile.headlineBeforeTr : profile.headlineBeforeEn,
    headlineAccent: tr ? profile.headlineAccentTr : profile.headlineAccentEn,
    lead: tr ? profile.leadTr : profile.leadEn,
    about: tr ? profile.aboutTr : profile.aboutEn,
    location: tr ? profile.locationTr : profile.locationEn,
    availability: tr ? profile.availabilityTr : profile.availabilityEn,
    stack: splitStack(profile.stack),
    portrait: portrait
      ? `${portrait}?v=${profile.updatedAt.getTime()}`
      : null,
    email: profile.email,
    whatsapp: profile.whatsapp,
    telegram: profile.telegram,
    github: profile.github,
    projects: projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: tr && project.slug === "business-websites" ? "İşletme siteleri" : project.title,
      kicker: tr ? project.kickerTr : project.kickerEn,
      summary: tr ? project.summaryTr : project.summaryEn,
      points: splitLines(tr ? project.pointsTr : project.pointsEn),
      url: project.url,
      urlLabel: project.urlLabel,
      url2: project.url2,
      urlLabel2: project.urlLabel2,
      tags: splitTags(project.tags),
      tone: project.tone,
    })),
    skills: skills.map((skill, index) => ({
      id: skill.id,
      index: String(index + 1).padStart(2, "0"),
      title: tr ? skill.titleTr : skill.titleEn,
      body: tr ? skill.bodyTr : skill.bodyEn,
    })),
  };
}

export type PublicContent = NonNullable<Awaited<ReturnType<typeof getPublicContent>>>;
export type PublicProject = PublicContent["projects"][number];
