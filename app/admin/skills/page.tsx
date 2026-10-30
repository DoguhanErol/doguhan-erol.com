import { SkillsManager } from "@/components/admin/skills-manager";
import { prisma } from "@/lib/db";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ sortOrder: "asc" }, { titleTr: "asc" }],
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Yetenekler</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Ana sayfadaki altı kart. Sıra numarası soldan sağa, yukarıdan aşağı okunur.</p>
      <SkillsManager skills={skills} />
    </div>
  );
}
