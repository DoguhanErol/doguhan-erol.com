type Paint = (dark: boolean) => void;

let paintIcon: Paint | null = null;

export function onThemePaint(paint: Paint) {
  paintIcon = paint;
  return () => {
    if (paintIcon === paint) paintIcon = null;
  };
}

export function setThemeClass(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  paintIcon?.(dark);
}
