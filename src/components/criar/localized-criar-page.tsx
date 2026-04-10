"use client";

import { CharacterFormWizard } from "@/components/character-form/character-form-wizard";
import { useIntl } from "@/components/i18n/app-intl-provider";

export function LocalizedCriarPage() {
  const { locale, t } = useIntl();

  return (
    <div className="page-section">
      <div className="layout-shell flex flex-col gap-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1 text-caption font-medium text-muted-foreground">
            {t("criarPage.badge")}
          </span>
          <div className="space-y-2">
            <h1 className="text-title max-w-2xl">{t("criarPage.title")}</h1>
            <p className="text-lead max-w-3xl text-muted-foreground text-pretty">
              {t("criarPage.lead")}
            </p>
          </div>
        </div>

        <CharacterFormWizard key={locale} />
      </div>
    </div>
  );
}
