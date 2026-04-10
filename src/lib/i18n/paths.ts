import type { Locale } from "@/lib/i18n/config";

/**
 * Build a pathname under a locale segment (no basePath — Next.js adds it for Link).
 * @param path - `"/"` for home, or a path like `"/criar"` (leading slash optional).
 */
export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path === "/" || path === "" ? "" : path.replace(/^\//, "");
  return normalized ? `/${locale}/${normalized}` : `/${locale}`;
}
