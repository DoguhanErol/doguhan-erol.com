import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminHomePage() {
  const [projects, skills, messages, unread] = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.skill.count({ where: { published: true } }),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
  ]);

  const cards = [
    { href: "/admin/projects", label: "Yayındaki proje", value: projects },
    { href: "/admin/skills", label: "Yetenek", value: skills },
    { href: "/admin/messages", label: "Okunmamış mesaj", value: unread },
    { href: "/admin/messages", label: "Tüm mesaj", value: messages },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Genel bakış</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Sitedeki metin, projeler ve gelen kutusu buradan değişir. Kayıt anında yayına gider.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-3xl border border-line bg-card p-5">
            <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
