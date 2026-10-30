import bcrypt from "bcryptjs";
import { prisma } from "./db";

const USERNAME_PATTERN = /^[\p{L}\p{N}._-]+$/u;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function normalizeUsername(value: string) {
  return value.trim();
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const value = normalizeUsername(username);
  if (value.length < 3) return "Kullanıcı adı en az 3 karakter olmalı.";
  if (value.length > 32) return "Kullanıcı adı en fazla 32 karakter olabilir.";
  if (!USERNAME_PATTERN.test(value)) {
    return "Kullanıcı adında yalnızca harf, rakam, nokta, alt çizgi ve tire olabilir.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Şifre en az 8 karakter olmalı.";
  if (password.length > 128) return "Şifre çok uzun.";
  return null;
}

export async function findUserByLogin(identifier: string) {
  const normalized = identifier.trim();
  if (!normalized) return null;

  return prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: normalized, mode: "insensitive" } },
        { email: { equals: normalized, mode: "insensitive" } },
      ],
    },
  });
}
