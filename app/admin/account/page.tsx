import { AccountForm } from "@/components/admin/account-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/account");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Hesap</h1>
      <AccountForm username={user.username} email={user.email} />
    </div>
  );
}
