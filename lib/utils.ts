import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitStack(value: string): string[] {
  return value
    .split(/[·,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitTags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "proje";
}

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function whatsappLink(raw: string | null | undefined): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}

export function telegramLink(raw: string | null | undefined): string | null {
  const handle = (raw || "").replace(/^@+/, "").trim();
  if (!/^[A-Za-z0-9_]{3,32}$/.test(handle)) return null;
  return `https://t.me/${handle}`;
}

export function telegramLabel(raw: string | null | undefined): string | null {
  const handle = (raw || "").replace(/^@+/, "").trim();
  if (!handle) return null;
  return `@${handle}`;
}

export function mailLink(raw: string | null | undefined): string | null {
  const email = (raw || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return `mailto:${email}`;
}
