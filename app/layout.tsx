import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

const sans = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist-mono",
});

const themeScript = `(function(){try{var stored=localStorage.getItem("theme");var targetDark=stored==="dark"||(stored!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;var root=document.documentElement;if(reduced||typeof document.startViewTransition!=="function"){root.classList.toggle("dark",targetDark);return;}root.classList.toggle("dark",!targetDark);root.dataset.themeIntro=targetDark?"to-dark":"to-light";}catch(e){}})();`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "Doğuhan Erol",
      template: "%s · Doğuhan Erol",
    },
    description:
      "Web sitesi, yönetim paneli ve özel yazılım geliştiriyorum. Qrivo kafe ve restoran paneli. Steam'de SCP-294. LaTeX, çeviri ve makale hazırlığı.",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      siteName: "Doğuhan Erol",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Doğuhan Erol" }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og.png"],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
