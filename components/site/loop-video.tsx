"use client";

import { useEffect, useRef } from "react";

export function LoopVideo({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const start = () => {
      void node.play().catch(() => {});
    };
    start();
    node.addEventListener("canplay", start);
    return () => node.removeEventListener("canplay", start);
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-label={label}
    />
  );
}
