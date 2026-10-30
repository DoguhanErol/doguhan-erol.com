"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicProject } from "@/lib/content";
import { safeHttpUrl } from "@/lib/utils";
import { SiteBuild } from "./site-build";

function HeroClip({
  src,
  label,
  aspect,
  onEnded,
}: {
  src: string;
  label: string;
  aspect: string;
  onEnded: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let fired = false;
    let timer = 0;
    const finish = () => {
      if (fired) return;
      fired = true;
      window.clearTimeout(timer);
      ended.current();
    };
    const arm = () => {
      const duration = node.duration;
      const ms = Number.isFinite(duration) ? duration * 1000 + 500 : 12000;
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, ms);
    };
    const start = () => {
      void node.play().catch(() => {});
    };
    start();
    node.addEventListener("canplay", start);
    node.addEventListener("loadedmetadata", arm);
    node.addEventListener("ended", finish);
    arm();
    return () => {
      window.clearTimeout(timer);
      node.removeEventListener("canplay", start);
      node.removeEventListener("loadedmetadata", arm);
      node.removeEventListener("ended", finish);
    };
  }, [src]);

  return (
    <div className="mx-auto w-[min(100%,250px)] overflow-hidden rounded-[1.75rem] border border-black/10 bg-black shadow-[0_30px_70px_-36px_rgba(23,23,23,0.55)]">
      <video
        ref={ref}
        className={`block ${aspect} w-full object-cover`}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label={label}
      />
    </div>
  );
}

export function WorkStage({
  projects,
  locale,
}: {
  projects: PublicProject[];
  locale: "tr" | "en";
}) {
  const [active, setActive] = useState(0);
  const project = projects[active];
  const goNext = useCallback(() => {
    setActive((current) => (projects.length ? (current + 1) % projects.length : 0));
  }, [projects.length]);
  if (!project) return null;
  const links = [
    { href: safeHttpUrl(project.url), label: project.urlLabel },
    { href: safeHttpUrl(project.url2), label: project.urlLabel2 },
  ].filter((item): item is { href: string; label: string } => Boolean(item.href && item.label));

  return (
    <div>
      <div className="flex min-h-[360px] items-center justify-center rounded-[1.8rem] bg-chip/70 px-4 py-8">
        {project.tone === "qrivo" ? (
          <HeroClip
            key={project.id}
            src="/media/qrivo-menu.mp4"
            aspect="aspect-[800/1760]"
            label={locale === "tr" ? "Qrivo menü videosu" : "Qrivo menu recording"}
            onEnded={goNext}
          />
        ) : project.tone === "scp" ? (
          <HeroClip
            key={project.id}
            src="/media/scp-steam.mp4"
            aspect="aspect-[800/1770]"
            label={locale === "tr" ? "SCP-294 oyun kaydı" : "SCP-294 on Steam"}
            onEnded={goNext}
          />
        ) : (
          <SiteBuild key={`${project.id}-${locale}`} locale={locale} onDone={goNext} />
        )}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist">
        {projects.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              className={`flex min-w-[8.5rem] items-center gap-2 rounded-2xl border px-2.5 py-2 text-left ${
                selected ? "border-ink bg-chip" : "border-line bg-transparent"
              }`}
            >
              {item.tone === "qrivo" || item.tone === "scp" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.tone === "qrivo" ? "/media/QrivoLogoSquare.png" : "/media/scplogo.png"}
                  alt=""
                  className="size-9 shrink-0 rounded-lg bg-black object-cover"
                />
              ) : (
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-card text-xs font-semibold tracking-tight">
                  {locale === "tr" ? "Site" : "Web"}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs text-muted">{item.kicker}</span>
              </span>
            </button>
          );
        })}
      </div>
      {links.length > 0 ? (
        <div className="mt-3">
          {project.slug === "business-websites" ? (
            <p className="mb-1 text-xs font-medium tracking-[0.16em] text-muted uppercase">
              {locale === "tr" ? "Örnekler" : "Examples"}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-medium text-accent"
            >
              {link.label} ↗
            </a>
          ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
