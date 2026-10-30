"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/actions/guard";
import {
  hashPassword,
  normalizeEmail,
  normalizeUsername,
  validatePassword,
  validateUsername,
} from "@/lib/credentials";
import { prisma } from "@/lib/db";
import type { ActionState } from "@/lib/validators";

export async function updateAccount(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session?.user?.id) return { ok: false, error: "Oturum kapandı. Tekrar girin." };

  const username = normalizeUsername(String(formData.get("username") || ""));
  const email = normalizeEmail(String(formData.get("email") || ""));
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");

  const usernameError = validateUsername(username);
  if (usernameError) return { ok: false, error: usernameError };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "E-posta geçerli değil." };
  }
  if (!currentPassword) return { ok: false, error: "Mevcut şifreyi yazın." };
  if (newPassword) {
    const passwordError = validatePassword(newPassword);
    if (passwordError) return { ok: false, error: passwordError };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { ok: false, error: "Hesap bulunamadı." };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { ok: false, error: "Mevcut şifre yanlış." };

  const taken = await prisma.user.findFirst({
    where: {
      NOT: { id: user.id },
      OR: [
        { username: { equals: username, mode: "insensitive" } },
        { email },
      ],
    },
  });
  if (taken) return { ok: false, error: "Bu kullanıcı adı veya e-posta kullanılıyor." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username,
      email,
      ...(newPassword ? { password: await hashPassword(newPassword) } : {}),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/account");
  return {
    ok: true,
    message: newPassword
      ? "Hesap ve şifre güncellendi. Diğer cihazlar eski oturumla açık kalır."
      : "Hesap güncellendi.",
  };
}
