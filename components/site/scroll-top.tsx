"use client";

import { useEffect, useState } from "react";

export function ScrollTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      href="#top"
      aria-label={label}
      className={`scroll-top fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-12 place-items-center rounded-full bg-ink text-lg text-paper shadow-[0_12px_30px_-16px_rgba(23,23,23,0.7)] transition-opacity duration-200 sm:right-6 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑
    </a>
  );
}
