"use client";

import { useEffect } from "react";

import {
  defaultLocale,
  isLocale,
  LOCALE_STORAGE_KEY,
} from "@/lib/i18n/config";

function publicBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export function RootLocaleRedirect() {
  useEffect(() => {
    const base = publicBasePath().replace(/\/$/, "");
    let preferred = defaultLocale;
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) preferred = stored;
    } catch {
      /* ignore */
    }
    const destPath = (base ? `${base}/` : "/") + `${preferred}/`;
    const norm = (p: string) => p.replace(/\/$/, "") || "/";
    if (norm(window.location.pathname) !== norm(destPath)) {
      window.location.replace(destPath + window.location.search);
    }
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="sr-only">Redirecting</p>
    </div>
  );
}
