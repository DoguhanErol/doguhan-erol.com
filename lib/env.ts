/** Runtime env. A static `process.env.NEXT_PUBLIC_*` read is baked in at image build. */
export function env(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}
