"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { isLocale } from "@/lib/i18n/config";

export function LocaleHtmlLang() {
  const params = useParams();
  const raw = params?.locale;
  const segment = Array.isArray(raw) ? raw[0] : raw;
  const locale = typeof segment === "string" && isLocale(segment) ? segment : "pt-BR";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
