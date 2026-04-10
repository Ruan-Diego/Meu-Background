"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  inputFieldClassName,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { useIntl } from "@/components/i18n/app-intl-provider";
import { RhfCountrySelect } from "@/components/character-form/rhf-select-fields";
import {
  ORIGIN_COUNTRY_OPTIONS,
  ORIGIN_REGION_SUGGESTIONS,
} from "@/lib/character-form/origin-constants";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { formatMessage } from "@/lib/i18n/format-message";
import { getOptionLabel } from "@/lib/i18n/option-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REGION_LIST_ID = "origin-region-suggestions";

export function OriginBackgroundFields() {
  const { messages, t } = useIntl();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  const relativesArray = useFieldArray({
    control,
    name: "relatives",
  });

  const eventsArray = useFieldArray({
    control,
    name: "shapingEvents",
  });

  const relativesValues = useWatch({ control, name: "relatives" }) ?? [];
  const [backgroundRevealedIds, setBackgroundRevealedIds] = useState(
    () => new Set<string>()
  );

  const revealRelativeBackground = useCallback((rowId: string) => {
    setBackgroundRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(rowId);
      return next;
    });
  }, []);

  return (
    <div className="space-y-10">
      <section className="space-y-4" aria-labelledby="origin-location-heading">
        <h3
          id="origin-location-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.origin.locationHeading")}
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldGroup id="birthCountry" label={t("fields.origin.country")}>
            <RhfCountrySelect
              control={control}
              name="birthCountry"
              id="birthCountry"
              options={ORIGIN_COUNTRY_OPTIONS}
              selectPlaceholder={t("common.selectPlaceholder")}
              formatOptionLabel={(key) =>
                getOptionLabel(messages, "originCountry", key)
              }
              aria-invalid={errors.birthCountry ? true : undefined}
              aria-describedby={
                errors.birthCountry ? "birthCountry-error" : undefined
              }
            />
            {errors.birthCountry ? (
              <FieldError
                id="birthCountry-error"
                message={errors.birthCountry.message}
              />
            ) : null}
          </FieldGroup>

          <FieldGroup id="birthRegion" label={t("fields.origin.region")}>
            <Input
              id="birthRegion"
              type="text"
              list={REGION_LIST_ID}
              autoComplete="off"
              placeholder={t("fields.origin.regionPlaceholder")}
              aria-invalid={errors.birthRegion ? true : undefined}
              aria-describedby={
                errors.birthRegion ? "birthRegion-error" : undefined
              }
              className={cn(inputFieldClassName)}
              {...register("birthRegion")}
            />
            <datalist id={REGION_LIST_ID}>
              {ORIGIN_REGION_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {errors.birthRegion ? (
              <FieldError
                id="birthRegion-error"
                message={errors.birthRegion.message}
              />
            ) : null}
          </FieldGroup>

          <div className="sm:col-span-2">
            <FieldGroup id="birthCity" label={t("fields.origin.city")}>
              <Input
                id="birthCity"
                type="text"
                autoComplete="off"
                aria-invalid={errors.birthCity ? true : undefined}
                aria-describedby={
                  errors.birthCity ? "birthCity-error" : undefined
                }
                className={cn(inputFieldClassName)}
                {...register("birthCity")}
              />
              {errors.birthCity ? (
                <FieldError
                  id="birthCity-error"
                  message={errors.birthCity.message}
                />
              ) : null}
            </FieldGroup>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="origin-relatives-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="origin-relatives-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.origin.relativesHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              relativesArray.append({
                kinship: "",
                name: "",
                background: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.origin.addRelative")}
          </Button>
        </div>

        {relativesArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.origin.relativesEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {relativesArray.fields.map((field, index) => {
              const rowErrors = errors.relatives?.[index];
              const bgStored = (relativesValues[index]?.background ?? "").trim();
              const showBackground =
                bgStored !== "" || backgroundRevealedIds.has(field.id);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.origin.bondLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => relativesArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.origin.removeBondAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`relatives-${field.id}-kinship`}
                      label={t("fields.origin.kinship")}
                    >
                      <Input
                        id={`relatives-${field.id}-kinship`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.kinship ? true : undefined}
                        aria-describedby={
                          rowErrors?.kinship
                            ? `relatives-${field.id}-kinship-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`relatives.${index}.kinship`)}
                      />
                      {rowErrors?.kinship ? (
                        <FieldError
                          id={`relatives-${field.id}-kinship-error`}
                          message={rowErrors.kinship.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <FieldGroup
                      id={`relatives-${field.id}-name`}
                      label={t("fields.origin.name")}
                    >
                      <Input
                        id={`relatives-${field.id}-name`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.name ? true : undefined}
                        aria-describedby={
                          rowErrors?.name
                            ? `relatives-${field.id}-name-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`relatives.${index}.name`)}
                      />
                      {rowErrors?.name ? (
                        <FieldError
                          id={`relatives-${field.id}-name-error`}
                          message={rowErrors.name.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <div className="sm:col-span-2 space-y-2">
                      {!showBackground ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit"
                          onClick={() => revealRelativeBackground(field.id)}
                        >
                          {t("common.addBackground")}
                        </Button>
                      ) : null}
                      <div className={showBackground ? "space-y-2" : "hidden"}>
                        <FieldGroup
                          id={`relatives-${field.id}-background`}
                          label={t("fields.personality.backgroundLabel")}
                        >
                          <Textarea
                            id={`relatives-${field.id}-background`}
                            autoComplete="off"
                            rows={3}
                            aria-invalid={
                              rowErrors?.background ? true : undefined
                            }
                            aria-describedby={
                              rowErrors?.background
                                ? `relatives-${field.id}-background-error`
                                : undefined
                            }
                            className={cn(textareaFieldClassName)}
                            {...register(`relatives.${index}.background`)}
                          />
                          {rowErrors?.background ? (
                            <FieldError
                              id={`relatives-${field.id}-background-error`}
                              message={rowErrors.background.message}
                            />
                          ) : null}
                        </FieldGroup>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="origin-events-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="origin-events-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.origin.eventsHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              eventsArray.append({
                eventName: "",
                myAge: "",
                description: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.origin.addEvent")}
          </Button>
        </div>

        {eventsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.origin.eventsEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {eventsArray.fields.map((field, index) => {
              const rowErrors = errors.shapingEvents?.[index];
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.origin.eventLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => eventsArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.origin.removeEventAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`shapingEvents-${field.id}-eventName`}
                      label={t("fields.origin.eventName")}
                    >
                      <Input
                        id={`shapingEvents-${field.id}-eventName`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.eventName ? true : undefined}
                        aria-describedby={
                          rowErrors?.eventName
                            ? `shapingEvents-${field.id}-eventName-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`shapingEvents.${index}.eventName`)}
                      />
                      {rowErrors?.eventName ? (
                        <FieldError
                          id={`shapingEvents-${field.id}-eventName-error`}
                          message={rowErrors.eventName.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <FieldGroup
                      id={`shapingEvents-${field.id}-myAge`}
                      label={t("fields.origin.myAge")}
                    >
                      <Input
                        id={`shapingEvents-${field.id}-myAge`}
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.myAge ? true : undefined}
                        aria-describedby={
                          rowErrors?.myAge
                            ? `shapingEvents-${field.id}-myAge-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`shapingEvents.${index}.myAge`)}
                      />
                      {rowErrors?.myAge ? (
                        <FieldError
                          id={`shapingEvents-${field.id}-myAge-error`}
                          message={rowErrors.myAge.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <div className="sm:col-span-2">
                      <FieldGroup
                        id={`shapingEvents-${field.id}-description`}
                        label={t("common.description")}
                      >
                        <Textarea
                          id={`shapingEvents-${field.id}-description`}
                          rows={4}
                          autoComplete="off"
                          aria-invalid={
                            rowErrors?.description ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.description
                              ? `shapingEvents-${field.id}-description-error`
                              : undefined
                          }
                          className={cn(textareaFieldClassName)}
                          {...register(`shapingEvents.${index}.description`)}
                        />
                        {rowErrors?.description ? (
                          <FieldError
                            id={`shapingEvents-${field.id}-description-error`}
                            message={rowErrors.description.message}
                          />
                        ) : null}
                      </FieldGroup>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
