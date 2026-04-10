"use client";

import { useIntl } from "@/components/i18n/app-intl-provider";

export function LocalizedFooter() {
  const { t } = useIntl();

  return (
    <footer className="border-t border-border/70 py-6">
      <div className="layout-shell flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption font-medium text-foreground">
            {t("shell.footerTitle")}
          </p>
          <p className="text-caption text-muted-foreground">
            {t("shell.footerTagline")}
          </p>
        </div>
        <p className="text-caption text-muted-foreground">
          {t("shell.footerPrivacy")}
        </p>
      </div>
    </footer>
  );
}
