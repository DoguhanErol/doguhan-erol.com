"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LocaleToggle, ThemeToggle } from "./toggles";

type Labels = {
  work: string;
  skills: string;
  about: string;
  contact: string;
  talk: string;
  toDark: string;
  toLight: string;
  localeLabel: string;
};

const LINKS: { href: string; key: keyof Pick<Labels, "work" | "skills" | "about" | "contact"> }[] = [
  { href: "#work", key: "work" },
  { href: "#skills", key: "skills" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contact" },
];

export function SiteHeader({
  name,
  locale,
  labels,
}: {
  name: string;
  locale: "tr" | "en";
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-4 px-5">
        <a href="#top" className="truncate font-display text-sm font-semibold tracking-tight">
          {name}
        </a>
        <nav className="ml-auto hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-ink">
              {labels[link.key]}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <LocaleToggle locale={locale} label={labels.localeLabel} />
          <ThemeToggle toDark={labels.toDark} toLight={labels.toLight} />
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper md:inline-flex"
          >
            {labels.talk}
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line md:hidden"
            aria-label={open ? "Close" : "Menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-line px-5 py-3 md:hidden" aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm"
            >
              {labels[link.key]}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
