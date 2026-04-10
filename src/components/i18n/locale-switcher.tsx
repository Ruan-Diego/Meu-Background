"use client";

import { usePathname, useRouter } from "next/navigation";

import { useIntl } from "@/components/i18n/app-intl-provider";
import {
  type Locale,
  LOCALE_STORAGE_KEY,
  isLocale,
} from "@/lib/i18n/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex items-center gap-2">
      <label htmlFor="locale-switcher" className="sr-only">
        {t("localeSwitcher.label")}
      </label>
      <Select
        value={locale}
        onValueChange={(v) => {
          if (isLocale(v)) onLocaleChange(v);
        }}
      >
        <SelectTrigger
          id="locale-switcher"
          size="sm"
          className="h-9 w-[min(100%,11rem)] border-border/70 bg-card/80 text-sm"
          aria-label={t("localeSwitcher.label")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="pt-BR">{t("localeSwitcher.ptBR")}</SelectItem>
          <SelectItem value="en">{t("localeSwitcher.en")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
