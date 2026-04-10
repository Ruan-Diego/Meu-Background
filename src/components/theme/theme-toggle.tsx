"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { useIntl } from "@/components/i18n/app-intl-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { t } = useIntl();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = mounted
    ? isDark
      ? t("shell.themeLight")
      : t("shell.themeDark")
    : t("shell.themeToggle");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="rounded-full"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? <SunMedium aria-hidden /> : <MoonStar aria-hidden />}
    </Button>
  );
}
