"use client";

import { useEffect, useState } from "react";

const copy = {
  tr: {
    label: "Örnek işletme sitesi",
    url: "isletmeniz.com",
    brand: "İşletmeniz",
    nav: ["Hizmetler", "Menü", "Hakkımızda", "İletişim"],
    loading: "Görsel hazırlanıyor",
    title: "İşletmeniz için web sitesi",
    body: "Menü, adres ve iletişim bir arada.",
    cta: "İletişime geçin",
    badge: "Mobil uyumlu",
  },
  en: {
    label: "Business site draft",
    url: "yourbusiness.com",
    brand: "Your business",
    nav: ["Services", "SEO", "Work", "Contact"],
    loading: "Image loading",
    title: "Take your business online",
    body: "Professional design. New customers from search.",
    cta: "Talk about a site",
    badge: "Get found on Google",
  },
} as const;

export function SiteBuild({
  locale,
  onDone,
}: {
  locale: "tr" | "en";
  onDone: () => void;
}) {
  const text = copy[locale];
  const [url, setUrl] = useState("");
  const [navCount, setNavCount] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageOn, setImageOn] = useState(false);
  const [ctaOn, setCtaOn] = useState(false);

  useEffect(() => {
    let stopped = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      if (!stopped) onDone();
    };

    if (reduced) {
      setUrl(text.url);
      setNavCount(text.nav.length);
      setTitle(text.title);
      setBody(text.body);
      setImageOn(true);
      setCtaOn(true);
      const hold = window.setTimeout(finish, 7000);
      return () => {
        stopped = true;
        window.clearTimeout(hold);
      };
    }

    setUrl("");
    setNavCount(0);
    setTitle("");
    setBody("");
    setImageOn(false);
    setCtaOn(false);

    const urlAt = 180;
    const navAt = urlAt + text.url.length * 32 + 160;
    const imageAt = navAt + text.nav.length * 150 + 280;
    const titleAt = imageAt + 700;
    const bodyAt = titleAt + text.title.length * 28 + 160;
    const ctaAt = bodyAt + text.body.length * 16 + 280;
    const doneAt = ctaAt + 2200;
    const started = performance.now();

    const timer = window.setInterval(() => {
      const t = performance.now() - started;
      const urlN = Math.min(text.url.length, Math.floor(Math.max(0, t - urlAt) / 32));
      const navN = Math.min(text.nav.length, Math.floor(Math.max(0, t - navAt) / 150));
      const titleN = Math.min(text.title.length, Math.floor(Math.max(0, t - titleAt) / 28));
      const bodyN = Math.min(text.body.length, Math.floor(Math.max(0, t - bodyAt) / 16));
      setUrl(text.url.slice(0, urlN));
      setNavCount(navN);
      setTitle(text.title.slice(0, titleN));
      setBody(text.body.slice(0, bodyN));
      setImageOn(t >= imageAt + 620);
      setCtaOn(t >= ctaAt);
      if (t >= doneAt) {
        window.clearInterval(timer);
        finish();
      }
    }, 40);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [locale, onDone, text]);

  const typingTitle = title.length < text.title.length;
  const typingBody = !typingTitle && body.length > 0 && body.length < text.body.length;
  const typingUrl = url.length > 0 && url.length < text.url.length;

  return (
    <div
      className="mx-auto flex aspect-[800/1760] w-[min(100%,250px)] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#fffdf8] text-[#171717] shadow-[0_30px_70px_-36px_rgba(23,23,23,0.55)]"
      aria-label={text.label}
    >
      <div className="flex items-center gap-1.5 border-b border-black/10 px-3 py-2">
        <span className="size-1.5 rounded-full bg-black/15" />
        <span className="size-1.5 rounded-full bg-black/15" />
        <span className="size-1.5 rounded-full bg-black/15" />
        <span className="ml-1 min-w-0 flex-1 truncate rounded-full bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] text-black/55">
          {url || " "}
          {typingUrl ? <span className="build-caret" /> : null}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-3.5 py-3">
        <p className="text-[13px] font-semibold tracking-tight">{text.brand}</p>
        <div className="mt-1.5 flex min-h-4 flex-wrap gap-x-2 gap-y-0.5">
          {text.nav.slice(0, navCount).map((item) => (
            <span key={item} className="build-pop text-[10px] text-black/50">
              {item}
            </span>
          ))}
        </div>
        <div className="relative mt-3 min-h-28 flex-1 overflow-hidden rounded-2xl bg-black/[0.05]">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              imageOn ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <span className="build-shimmer absolute inset-y-0 left-0 w-1/2 bg-white/70" />
            <span className="relative text-[11px] text-black/45">{text.loading}</span>
          </div>
          <div
            className={`absolute inset-3 transition-opacity duration-500 ${
              imageOn ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <div className="build-pop flex h-full flex-col justify-between rounded-xl border border-black/10 bg-white p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#2f46f0]" />
                <span className="h-1.5 flex-1 rounded-full bg-black/10" />
              </div>
              <div className="flex items-end gap-2">
                <span className="size-9 shrink-0 rounded-lg bg-[#2f46f0]" />
                <span className="mb-1 h-7 flex-1 rounded-md bg-black/80" />
              </div>
              <div className="space-y-1.5">
                <span className="block h-1.5 w-4/5 rounded-full bg-black/15" />
                <span className="block h-1.5 w-3/5 rounded-full bg-black/10" />
              </div>
            </div>
          </div>
        </div>
        <h3 className="mt-3 min-h-[2.7rem] font-display text-[15px] leading-[1.15] font-semibold tracking-[-0.03em]">
          {title || "\u00a0"}
          {typingTitle && title.length > 0 ? <span className="build-caret" /> : null}
        </h3>
        <p className="mt-1 min-h-[2rem] text-[11px] leading-relaxed text-black/55">
          {body || "\u00a0"}
          {typingBody ? <span className="build-caret" /> : null}
        </p>
        <div
          className={`mt-2 grid gap-1.5 transition-opacity duration-500 ${
            ctaOn ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="inline-flex h-7 items-center justify-center rounded-full bg-[#2f46f0] px-2 text-[10px] font-medium text-white">
            {text.cta}
          </span>
          <span className="inline-flex h-7 items-center justify-center rounded-full border border-black/10 px-2 text-[10px] text-black/60">
            {text.badge}
          </span>
        </div>
      </div>
    </div>
  );
}
