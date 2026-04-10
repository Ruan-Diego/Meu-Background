"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  inputFieldClassName,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { useIntl } from "@/components/i18n/app-intl-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { formatMessage } from "@/lib/i18n/format-message";
import { cn } from "@/lib/utils";

export function FreeNotesFields() {
  const { t } = useIntl();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "freeNotes",
  });

  return (
    <section className="space-y-4" aria-labelledby="free-notes-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3
          id="free-notes-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.freeNotes.heading")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            append({
              topic: "",
              description: "",
            })
          }
        >
          <Plus data-icon="inline-start" className="size-4" />
          {t("fields.freeNotes.addTopic")}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-body text-muted-foreground">
          {t("fields.freeNotes.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {fields.map((field, index) => {
            const rowErrors = errors.freeNotes?.[index];
            return (
              <li
                key={field.id}
                className="rounded-lg border border-border/80 bg-muted/20 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-caption font-medium text-muted-foreground">
                    {formatMessage(t("fields.freeNotes.blockLabel"), {
                      n: index + 1,
                    })}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={formatMessage(
                      t("fields.freeNotes.removeNoteAria"),
                      { n: index + 1 },
                    )}
                  >
                    <Trash2 className="size-4" />
                    {t("common.remove")}
                  </Button>
                </div>
                <div className="space-y-4">
                  <FieldGroup
                    id={`freeNotes-${field.id}-topic`}
                    label={t("fields.freeNotes.topicLabel")}
                  >
                    <Input
                      id={`freeNotes-${field.id}-topic`}
                      type="text"
                      autoComplete="off"
                      aria-invalid={rowErrors?.topic ? true : undefined}
                      aria-describedby={
                        rowErrors?.topic
                          ? `freeNotes-${field.id}-topic-error`
                          : undefined
                      }
                      className={cn(inputFieldClassName)}
                      {...register(`freeNotes.${index}.topic`)}
                    />
                    {rowErrors?.topic ? (
                      <FieldError
                        id={`freeNotes-${field.id}-topic-error`}
                        message={rowErrors.topic.message}
                      />
                    ) : null}
                  </FieldGroup>

                  <FieldGroup
                    id={`freeNotes-${field.id}-description`}
                    label={t("common.description")}
                  >
                    <Textarea
                      id={`freeNotes-${field.id}-description`}
                      rows={5}
                      autoComplete="off"
                      aria-invalid={
                        rowErrors?.description ? true : undefined
                      }
                      aria-describedby={
                        rowErrors?.description
                          ? `freeNotes-${field.id}-description-error`
                          : undefined
                      }
                      className={cn(textareaFieldClassName)}
                      {...register(`freeNotes.${index}.description`)}
                    />
                    {rowErrors?.description ? (
                      <FieldError
                        id={`freeNotes-${field.id}-description-error`}
                        message={rowErrors.description.message}
                      />
                    ) : null}
                  </FieldGroup>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
