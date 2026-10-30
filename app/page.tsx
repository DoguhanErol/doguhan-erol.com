import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HomePage } from "@/components/site/home";
import { getPublicContent } from "@/lib/content";
import type { SiteLocale } from "@/lib/locale";
import { seoDescription, seoImageAlt, structuredData } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as SiteLocale;
  const content = await getPublicContent(locale);
  if (!content) return {};
  const description = seoDescription(locale);
  const title = `${content.name} — ${content.role}`;
  const image = { url: "/og.png", width: 1200, height: 630, alt: seoImageAlt(locale) };
  return {
    title: { absolute: title },
    description,
    authors: [{ name: content.name, url: getSiteUrl() }],
    creator: content.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: getSiteUrl() },
    openGraph: {
      title,
      description,
      url: getSiteUrl(),
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      type: "website",
      siteName: content.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page() {
  const locale = (await getLocale()) as SiteLocale;
  const content = await getPublicContent(locale);
  const t = await getTranslations();

  if (!content) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">İçerik henüz yok</h1>
        <p className="mt-3 text-muted">Veritabanı hazır olunca sayfa dolar. Lokal için npm run local.</p>
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData(locale, content) }}
      />
      <HomePage
        content={content}
        locale={locale}
        copy={{
          nav: {
            work: t("nav.work"),
            skills: t("nav.skills"),
            about: t("nav.about"),
            contact: t("nav.contact"),
            talk: t("nav.talk"),
          },
          hero: { seeWork: t("hero.seeWork"), talk: t("hero.talk") },
          work: { kicker: t("work.kicker"), title: t("work.title"), lead: t("work.lead") },
          skills: { kicker: t("skills.kicker"), title: t("skills.title") },
          about: { kicker: t("about.kicker"), title: t("about.title", { name: content.name }) },
          contact: {
            kicker: t("contact.kicker"),
            title: t("contact.title"),
            lead: t("contact.lead"),
            email: t("contact.email"),
            whatsapp: t("contact.whatsapp"),
            telegram: t("contact.telegram"),
            github: t("contact.github"),
            name: t("contact.name"),
            namePlaceholder: t("contact.namePlaceholder"),
            emailLabel: t("contact.emailLabel"),
            emailPlaceholder: t("contact.emailPlaceholder"),
            message: t("contact.message"),
            messagePlaceholder: t("contact.messagePlaceholder"),
            send: t("contact.send"),
            sending: t("contact.sending"),
            sent: t("contact.sent"),
            error: t("contact.error"),
            rate: t("contact.rate"),
          },
          footer: { top: t("footer.top") },
          theme: { toDark: t("theme.toDark"), toLight: t("theme.toLight") },
          locale: { switchToEn: t("locale.switchToEn"), switchToTr: t("locale.switchToTr") },
        }}
      />
    </>
  );
}
