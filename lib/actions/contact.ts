"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";
import { contactSchema, type ActionState } from "@/lib/validators";

export async function sendMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const honeypot = String(formData.get("company") || "");
  if (honeypot) return { ok: true, message: "sent" };

  const ip = await getRequestIp();
  const rate = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000, 20 * 60 * 1000);
  if (!rate.allowed) return { ok: false, error: "rate" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name") || "",
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };

  await prisma.message.create({
    data: {
      name: parsed.data.name || "",
      email: parsed.data.email.trim().toLowerCase(),
      body: parsed.data.message,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { ok: true, message: "sent" };
}
