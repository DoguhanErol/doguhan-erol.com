export const SITE_LOCALES = ["tr", "en"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];
export const SITE_LOCALE_COOKIE = "site_locale";

export function resolveLocale(cookieValue: string | null | undefined): SiteLocale {
  const cookie = cookieValue?.trim().toLowerCase();
  if (cookie === "en" || cookie === "tr") return cookie;
  return "en";
}
