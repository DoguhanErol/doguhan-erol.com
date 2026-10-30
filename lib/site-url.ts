import { env } from "./env";

export function getRootDomain(): string {
  return env("ROOT_DOMAIN") || env("NEXT_PUBLIC_ROOT_DOMAIN") || "localhost:3010";
}

export function getSiteUrl(): string {
  const root = getRootDomain();
  if (root.includes("localhost") || root.startsWith("127.")) {
    return `http://${root}`;
  }
  return `https://${root}`;
}
