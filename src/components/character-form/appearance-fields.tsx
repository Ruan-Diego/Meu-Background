"use client";

import { ExternalLink } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FieldGroup,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { useIntl } from "@/components/i18n/app-intl-provider";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

const HERO_FORGE_URL = "https://www.heroforge.com";
const HERO_NOTE_TOKEN = "{heroForgeLink}";

function renderMvpBody(body: string, emphasis: string) {
  const i = body.indexOf(emphasis);
  if (i === -1) {
    return body;
  }
  return (
    <>
      {body.slice(0, i)}
      <strong className="font-medium text-foreground">{emphasis}</strong>
      {body.slice(i + emphasis.length)}
    </>
  );
}

export function AppearanceFields() {
  const { t } = useIntl();
  const { register } = useFormContext<CharacterFormValues>();

  const heroNote = t("fields.appearance.heroNote");
  const heroParts = heroNote.split(HERO_NOTE_TOKEN);
  const linkText = t("fields.appearance.heroForgeLinkText");

  return (
    <div className="space-y-8">
      <div
        className="rounded-lg border border-border/80 bg-muted/25 p-4 text-body text-muted-foreground"
        role="note"
      >
        <p className="text-foreground">
          {heroParts[0]}
          <a
            href={HERO_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {linkText}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          </a>
          {heroParts[1] ?? ""}
        </p>
      </div>

      <div
        className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-4 text-body text-muted-foreground dark:border-amber-400/30 dark:bg-amber-400/10"
        role="status"
        aria-live="polite"
      >
        <p className="font-medium text-foreground">
          {t("fields.appearance.mvpTitle")}
        </p>
        <p className="mt-2">
          {renderMvpBody(
            t("fields.appearance.mvpBody"),
            t("fields.appearance.mvpEmphasis"),
          )}
        </p>
      </div>

      <section className="space-y-4" aria-labelledby="appearance-body-heading">
        <h3
          id="appearance-body-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.appearance.bodyHeading")}
        </h3>
        <FieldGroup
          id="heightDescription"
          label={t("fields.appearance.heightLabel")}
        >
          <Textarea
            id="heightDescription"
            {...register("heightDescription")}
            className={cn(textareaFieldClassName)}
            placeholder={t("fields.appearance.heightPlaceholder")}
            rows={3}
          />
        </FieldGroup>

        <FieldGroup
          id="hiddenMarksAndScars"
          label={t("fields.appearance.marksLabel")}
        >
          <Textarea
            id="hiddenMarksAndScars"
            {...register("hiddenMarksAndScars")}
            className={cn(textareaFieldClassName)}
            placeholder={t("fields.appearance.marksPlaceholder")}
            rows={3}
          />
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="appearance-presence-heading">
        <h3
          id="appearance-presence-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.appearance.presenceHeading")}
        </h3>
        <FieldGroup
          id="firstImpression"
          label={t("fields.appearance.firstImpressionsLabel")}
        >
          <Textarea
            id="firstImpression"
            {...register("firstImpression")}
            className={cn(textareaFieldClassName)}
            placeholder={t("fields.appearance.firstImpressionsPlaceholder")}
            rows={3}
          />
        </FieldGroup>
        <FieldGroup
          id="voiceAndSpeech"
          label={t("fields.appearance.voiceLabel")}
        >
          <Textarea
            id="voiceAndSpeech"
            {...register("voiceAndSpeech")}
            className={cn(textareaFieldClassName)}
            placeholder={t("fields.appearance.voicePlaceholder")}
            rows={3}
          />
        </FieldGroup>
        <FieldGroup
          id="movementAndMannerisms"
          label={t("fields.appearance.movementLabel")}
        >
          <Textarea
            id="movementAndMannerisms"
            {...register("movementAndMannerisms")}
            className={cn(textareaFieldClassName)}
            placeholder={t("fields.appearance.movementPlaceholder")}
            rows={3}
          />
        </FieldGroup>
      </section>
    </div>
  );
}
