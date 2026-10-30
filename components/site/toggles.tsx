"use client";

import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { onThemePaint } from "@/lib/theme-intro";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const [dark, setDark] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    return onThemePaint(setDark);
  }, []);

  function apply(next: boolean) {
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  function toggle() {
    if (busy.current) return;
    const next = !document.documentElement.classList.contains("dark");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = (document as ViewTransitionDocument).startViewTransition;
    if (!start || reduced) {
      apply(next);
      return;
    }

    busy.current = true;
    document.documentElement.dataset.themeDir = next ? "to-dark" : "to-light";
    const transition = start.call(document, () => {
      flushSync(() => apply(next));
    });
    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeDir;
      busy.current = false;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? toLight : toDark}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-chip text-ink"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function LocaleToggle({
  locale,
  label,
}: {
  locale: "tr" | "en";
  label: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const next = locale === "tr" ? "en" : "tr";

  async function change() {
    setPending(true);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={change}
      disabled={pending}
      aria-label={label}
      className="inline-flex h-10 items-center rounded-full border border-line bg-chip px-3 text-xs font-semibold tracking-wide text-ink"
    >
      {next.toUpperCase()}
    </button>
  );
}
