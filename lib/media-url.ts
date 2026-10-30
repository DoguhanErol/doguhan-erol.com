import { env } from "./env";

export function getMediaPublicBase(): string {
  return (env("MINIO_PUBLIC_URL") || env("NEXT_PUBLIC_MINIO_PUBLIC_URL") || "http://localhost:9010/portfolio").replace(
    /\/$/,
    ""
  );
}

export function extractMediaKeyFromUrl(url: string): string | null {
  const base = getMediaPublicBase();
  const prefix = `${base}/`;
  if (url.startsWith(prefix)) return url.slice(prefix.length);

  try {
    const parsed = new URL(url);
    let path = parsed.pathname.replace(/^\//, "");
    const bucket = process.env.MINIO_BUCKET_NAME || "portfolio";
    if (path.startsWith(`${bucket}/`)) path = path.slice(bucket.length + 1);
    return path || null;
  } catch {
    return null;
  }
}

export function resolvePublicMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const key = extractMediaKeyFromUrl(url);
  if (key) return `${getMediaPublicBase()}/${key}`;
  return url;
}
