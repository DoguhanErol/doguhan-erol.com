import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const unread = await prisma.message.count({ where: { read: false } });

  return (
    <AdminShell email={session.user.email || session.user.username} unread={unread}>
      {children}
    </AdminShell>
  );
}
