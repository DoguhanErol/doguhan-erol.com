import { ProjectsManager } from "@/components/admin/projects-manager";
import { prisma } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Projeler</h1>
      <p className="mt-2 mb-6 max-w-xl text-sm text-muted">
        Türkçe ve İngilizce ayrı durur. Maddeleri satır satır yazın. Qrivo ve SCP görünümü hazır çizim kullanır.
      </p>
      <ProjectsManager projects={projects} />
    </div>
  );
}
