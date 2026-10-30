import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { resolveLocale, SITE_LOCALE_COOKIE } from "@/lib/locale";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(SITE_LOCALE_COOKIE)?.value);

  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
