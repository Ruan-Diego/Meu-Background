"use client";

import { usePathname, useRouter } from "next/navigation";

import { useIntl } from "@/components/i18n/app-intl-provider";
import {
  type Locale,
  LOCALE_STORAGE_KEY,
  isLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { BrazilFlagIcon, UkFlagIcon } from "@/components/i18n/locale-flag-icons";
import type { ComponentType } from "react";

const LOCALE_OPTIONS: readonly {
  value: Locale;
  code: string;
  Flag: ComponentType<{ className?: string }>;
  labelKey: "localeSwitcher.ptBR" | "localeSwitcher.en";
}[] = [
  { value: "pt-BR", code: "pt", Flag: BrazilFlagIcon, labelKey: "localeSwitcher.ptBR" },
  { value: "en", code: "en", Flag: UkFlagIcon, labelKey: "localeSwitcher.en" },
];

function pathnameWithLocale(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${nextLocale}`;
  if (isLocale(segments[0])) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }
  return `/${nextLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function LocaleSwitcher() {
  const { locale, t } = useIntl();
  const pathname = usePathname();
  const router = useRouter();

  const onLocaleChange = (next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore quota / private mode */
    }
    const path = pathnameWithLocale(pathname, next);
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    router.push(`${path}${search}`);
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-border/70 bg-card/80 p-0.5"
      role="group"
      aria-label={t("localeSwitcher.label")}
    >
      {LOCALE_OPTIONS.map((opt) => {
        const active = locale === opt.value;
        const Flag = opt.Flag;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onLocaleChange(opt.value)}
            aria-pressed={active}
            aria-label={t(opt.labelKey)}
            className={cn(
              "inline-flex h-8 min-w-14 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Flag />
            <span className="text-xs font-semibold tracking-wide">{opt.code}</span>
          </button>
        );
      })}
    </div>
  );
}
