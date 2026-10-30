"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/actions/guard";
import { prisma } from "@/lib/db";

async function allowed() {
  const session = await requireAdmin();
  return Boolean(session);
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function markMessageRead(formData: FormData) {
  if (!(await allowed())) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.message.update({ where: { id }, data: { read: true } });
  refresh();
}

export async function markMessageUnread(formData: FormData) {
  if (!(await allowed())) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.message.update({ where: { id }, data: { read: false } });
  refresh();
}

export async function deleteMessage(formData: FormData) {
  if (!(await allowed())) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.message.delete({ where: { id } });
  refresh();
}
