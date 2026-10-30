"use client";

import { useEffect } from "react";
import { flushSync } from "react-dom";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { setThemeClass } from "@/lib/theme-intro";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const dir = root.dataset.themeIntro;
    if (dir !== "to-dark" && dir !== "to-light") return;
    const frame = requestAnimationFrame(() => {
      if (root.dataset.themeIntro !== dir) return;
      delete root.dataset.themeIntro;
      const next = dir === "to-dark";
      const start = (document as ViewTransitionDocument).startViewTransition;
      if (!start) {
        setThemeClass(next);
        return;
      }
      root.dataset.themeDir = dir;
      const transition = start.call(document, () => {
        flushSync(() => setThemeClass(next));
      });
      transition.finished.finally(() => {
        delete root.dataset.themeDir;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" />
    </SessionProvider>
  );
}
