import { contactInstagram, contactSubstack } from "./defaults";
import type { PublicContent } from "./content";
import type { SiteLocale } from "./locale";
import { getSiteUrl } from "./site-url";

const descriptionTr =
  "Web sitesi, yönetim paneli ve özel yazılım geliştiriyorum. Qrivo kafe ve restoran paneli. Steam'de SCP-294. LaTeX, çeviri ve makale hazırlığı.";

const descriptionEn =
  "I develop websites, dashboards and custom software. Qrivo runs café and restaurant operations. SCP-294 is on Steam. LaTeX, translation and paper preparation.";

export function seoDescription(locale: SiteLocale): string {
  return locale === "tr" ? descriptionTr : descriptionEn;
}

export function seoImageAlt(locale: SiteLocale): string {
  return locale === "tr" ? "Doğuhan Erol logosu" : "Doğuhan Erol logo";
}

export function structuredData(locale: SiteLocale, content: PublicContent): string {
  const url = getSiteUrl();
  const personId = `${url}/#person`;
  const description = seoDescription(locale);
  const sameAs = [content.github, contactInstagram, contactSubstack];
  const works: Record<string, unknown>[] = [];

  for (const project of content.projects) {
    if (project.slug === "qrivo" && project.url) {
      works.push({
        "@type": "SoftwareApplication",
        name: "Qrivo",
        url: project.url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: project.summary,
        creator: { "@id": personId },
      });
    }
    if (project.slug === "scp-294" && project.url) {
      if (project.url2?.includes("instagram.com")) sameAs.push(project.url2);
      works.push({
        "@type": "VideoGame",
        name: project.title,
        url: project.url,
        gamePlatform: "PC",
        description: project.summary,
        author: { "@id": personId },
      });
    }
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: content.name,
        description,
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: content.name,
        url,
        image: [`${url}/media/portre.webp`, `${url}/icon-512.png`],
        jobTitle: content.role,
        description,
        email: content.email || undefined,
        knowsLanguage: ["tr", "en", "ru"],
        address: { "@type": "PostalAddress", addressCountry: "TR" },
        sameAs: sameAs.filter(Boolean),
      },
      ...works,
    ],
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
