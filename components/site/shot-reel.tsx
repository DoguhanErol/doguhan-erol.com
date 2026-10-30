"use client";

import { useEffect, useState } from "react";

const shots = [
  {
    src: "/media/parmass.png",
    label: "Parma Pizza",
    href: "https://parmapizzatr.com/",
    alt: "Parma Pizza ana sayfası",
  },
  {
    src: "/media/maestross.png",
    label: "Mila Maestro",
    href: "https://www.milamaestro.com/",
    alt: "Maestro Cafe ana sayfası",
  },
  {
    src: "/media/qrivoss.png",
    label: "Qrivo",
    href: "https://qrivo.online/",
    alt: "Qrivo ana sayfası",
  },
] as const;

export function ShotReel({ locale }: { locale: "tr" | "en" }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const shot = shots[index] ?? shots[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % shots.length);
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [index, reduced]);

  return (
    <div className="mt-6">
      <div className="relative aspect-[2.35/1] overflow-hidden rounded-2xl border border-line bg-chip">
        {shots.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={active ? item.alt : ""}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-out ${
                active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            />
          );
        })}
        <a
          href={shot.href}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 left-3 inline-flex h-8 items-center rounded-full bg-paper/92 px-3 text-xs font-medium text-ink"
        >
          {shot.label} ↗
        </a>
        {reduced ? null : (
          <span
            key={index}
            className="shot-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          />
        )}
      </div>
      <div className="mt-3 flex items-center gap-2" role="tablist" aria-label={locale === "tr" ? "Site ekran görüntüleri" : "Site screenshots"}>
        {shots.map((item, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={item.label}
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                selected ? "w-6 bg-ink" : "w-1.5 bg-ink/25"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
