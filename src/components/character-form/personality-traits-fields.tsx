"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
  type FieldErrors,
} from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  inputFieldClassName,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { useIntl } from "@/components/i18n/app-intl-provider";
import { RhfEnumStringSelect } from "@/components/character-form/rhf-select-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import {
  PERSONALITY_FEAR_LEVELS,
  TEMPERAMENT_CHIP_OPTIONS,
  VALUES_CHIP_OPTIONS,
} from "@/lib/character-form/personality-constants";
import { formatMessage } from "@/lib/i18n/format-message";
import { getOptionLabel } from "@/lib/i18n/option-labels";
import { cn } from "@/lib/utils";

const VALUE_PRESET_SET = new Set<string>(VALUES_CHIP_OPTIONS);
const TEMPERAMENT_PRESET_SET = new Set<string>(TEMPERAMENT_CHIP_OPTIONS);

function PresetChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const safeId = `preset-chip-${label.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;
  return (
    <Toggle
      type="button"
      id={safeId}
      pressed={selected}
      onPressedChange={() => onToggle()}
      variant="outline"
      className={cn(
        "h-auto min-h-0 rounded-full border px-3 py-1.5 text-sm font-medium",
        "data-[state=off]:border-border data-[state=off]:bg-background data-[state=off]:text-muted-foreground data-[state=off]:hover:border-ring data-[state=off]:hover:text-foreground",
        "data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-foreground data-[state=on]:hover:border-primary data-[state=on]:hover:bg-primary/20 data-[state=on]:hover:text-foreground",
        "aria-pressed:border-primary aria-pressed:bg-primary/15 aria-pressed:text-foreground aria-pressed:hover:border-primary aria-pressed:hover:bg-primary/20 aria-pressed:hover:text-foreground"
      )}
    >
      {label}
    </Toggle>
  );
}

function CustomTagChip({
  label,
  onRemove,
  removeLabelAria,
  removeButtonAria,
}: {
  label: string;
  onRemove: () => void;
  removeLabelAria: string;
  removeButtonAria: string;
}) {
  return (
    <Badge
      variant="outline"
      className="inline-flex h-auto max-w-full min-h-0 items-center gap-0.5 rounded-full border-primary bg-primary/15 py-1 pl-3 pr-1 text-sm font-medium text-foreground"
    >
      <button
        type="button"
        className="min-w-0 truncate rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onRemove}
        aria-label={removeLabelAria}
      >
        {label}
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-7 shrink-0 rounded-full text-muted-foreground hover:bg-background/80 hover:text-foreground"
        aria-label={removeButtonAria}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="size-3.5" aria-hidden />
      </Button>
    </Badge>
  );
}

function ChipPickerSection({
  presets,
  presetSet,
  tags,
  ariaLabel,
  presetLabel,
  onTogglePreset,
  onRemoveCustom,
  customRemoveLabelAria,
  customRemoveButtonAria,
  draft,
  onDraftChange,
  onAddCustom,
  addButtonLabel,
  inputId,
  inputLabel,
}: {
  presets: readonly string[];
  presetSet: Set<string>;
  tags: string[];
  ariaLabel: string;
  presetLabel: (presetKey: string) => string;
  onTogglePreset: (label: string) => void;
  onRemoveCustom: (label: string) => void;
  customRemoveLabelAria: (visibleLabel: string) => string;
  customRemoveButtonAria: (visibleLabel: string) => string;
  draft: string;
  onDraftChange: (value: string) => void;
  onAddCustom: () => void;
  addButtonLabel: string;
  inputId: string;
  inputLabel: string;
}) {
  const customTags = tags.filter((t) => !presetSet.has(t));

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
        {presets.map((opt) => (
          <PresetChip
            key={opt}
            label={presetLabel(opt)}
            selected={tags.includes(opt)}
            onToggle={() => onTogglePreset(opt)}
          />
        ))}
        {customTags.map((tag) => (
          <CustomTagChip
            key={tag}
            label={tag}
            onRemove={() => onRemoveCustom(tag)}
            removeLabelAria={customRemoveLabelAria(tag)}
            removeButtonAria={customRemoveButtonAria(tag)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <FieldGroup id={inputId} label={inputLabel}>
          <Input
            id={inputId}
            type="text"
            autoComplete="off"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddCustom();
              }
            }}
            className={cn(inputFieldClassName)}
          />
        </FieldGroup>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit shrink-0"
          onClick={onAddCustom}
        >
          <Plus data-icon="inline-start" className="size-4" />
          {addButtonLabel}
        </Button>
      </div>
    </>
  );
}

type SingleLineRowErrors = FieldErrors<
  CharacterFormValues["flaws"][number]
> | undefined;

type FearRowErrors = FieldErrors<CharacterFormValues["fears"][number]> | undefined;

export function PersonalityTraitsFields() {
  const { messages, t } = useIntl();
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  const temperamentTags =
    useWatch({ control, name: "temperamentTags" }) ?? [];
  const valueTags = useWatch({ control, name: "valueTags" }) ?? [];
  const flawsWatched = useWatch({ control, name: "flaws" }) ?? [];
  const fearsWatched = useWatch({ control, name: "fears" }) ?? [];
  const habitsWatched = useWatch({ control, name: "habits" }) ?? [];
  const quirksWatched = useWatch({ control, name: "quirks" }) ?? [];

  const [customTemperamentDraft, setCustomTemperamentDraft] = useState("");
  const [customValueDraft, setCustomValueDraft] = useState("");
  const [backgroundRevealedIds, setBackgroundRevealedIds] = useState(
    () => new Set<string>()
  );

  const revealBackground = useCallback((key: string) => {
    setBackgroundRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const flawsArray = useFieldArray({ control, name: "flaws" });
  const fearsArray = useFieldArray({ control, name: "fears" });
  const habitsArray = useFieldArray({ control, name: "habits" });
  const quirksArray = useFieldArray({ control, name: "quirks" });

  const toggleInList = useCallback(
    (field: "temperamentTags" | "valueTags", label: string) => {
      const current = getValues(field) ?? [];
      const next = current.includes(label)
        ? current.filter((t) => t !== label)
        : [...current, label];
      setValue(field, next, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue, getValues]
  );

  const removeFromList = useCallback(
    (field: "temperamentTags" | "valueTags", label: string) => {
      const current = getValues(field) ?? [];
      setValue(
        field,
        current.filter((t) => t !== label),
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
    },
    [setValue, getValues]
  );

  const addCustomToList = useCallback(
    (
      field: "temperamentTags" | "valueTags",
      draft: string,
      clearDraft: () => void
    ) => {
      const trimmed = draft.trim();
      if (!trimmed) return;
      const current = getValues(field) ?? [];
      if (current.includes(trimmed)) {
        clearDraft();
        return;
      }
      setValue(field, [...current, trimmed], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      clearDraft();
    },
    [setValue, getValues]
  );

  return (
    <div className="space-y-10">
      <section
        className="space-y-4"
        aria-labelledby="personality-temperament-heading"
      >
        <h3
          id="personality-temperament-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.personality.temperamentHeading")}
        </h3>
        <p className="text-body text-muted-foreground">
          {t("fields.personality.temperamentIntro")}
        </p>
        <ChipPickerSection
          presets={TEMPERAMENT_CHIP_OPTIONS}
          presetSet={TEMPERAMENT_PRESET_SET}
          tags={temperamentTags}
          ariaLabel={t("fields.personality.temperamentHeading")}
          presetLabel={(key) => getOptionLabel(messages, "temperamentChips", key)}
          onTogglePreset={(opt) => toggleInList("temperamentTags", opt)}
          onRemoveCustom={(tag) => removeFromList("temperamentTags", tag)}
          customRemoveLabelAria={(visible) =>
            formatMessage(t("fields.personality.removeChipAria"), {
              label: visible,
            })
          }
          customRemoveButtonAria={(visible) =>
            formatMessage(t("fields.personality.removeChipButtonAria"), {
              label: visible,
            })
          }
          draft={customTemperamentDraft}
          onDraftChange={setCustomTemperamentDraft}
          onAddCustom={() =>
            addCustomToList(
              "temperamentTags",
              customTemperamentDraft,
              () => setCustomTemperamentDraft("")
            )
          }
          addButtonLabel={t("fields.personality.addChip")}
          inputId="custom-temperament-input"
          inputLabel={t("fields.personality.addTemperament")}
        />
      </section>

      <section className="space-y-4" aria-labelledby="personality-values-heading">
        <h3
          id="personality-values-heading"
          className="text-sm font-semibold text-foreground"
        >
          {t("fields.personality.valuesHeading")}
        </h3>
        <p className="text-body text-muted-foreground">
          {t("fields.personality.valuesIntro")}
        </p>
        <ChipPickerSection
          presets={VALUES_CHIP_OPTIONS}
          presetSet={VALUE_PRESET_SET}
          tags={valueTags}
          ariaLabel={t("fields.personality.valuesHeading")}
          presetLabel={(key) => getOptionLabel(messages, "valueChips", key)}
          onTogglePreset={(opt) => toggleInList("valueTags", opt)}
          onRemoveCustom={(tag) => removeFromList("valueTags", tag)}
          customRemoveLabelAria={(visible) =>
            formatMessage(t("fields.personality.removeChipAria"), {
              label: visible,
            })
          }
          customRemoveButtonAria={(visible) =>
            formatMessage(t("fields.personality.removeChipButtonAria"), {
              label: visible,
            })
          }
          draft={customValueDraft}
          onDraftChange={setCustomValueDraft}
          onAddCustom={() =>
            addCustomToList("valueTags", customValueDraft, () =>
              setCustomValueDraft("")
            )
          }
          addButtonLabel={t("fields.personality.addChip")}
          inputId="custom-value-input"
          inputLabel={t("fields.personality.addValue")}
        />
      </section>

      <section className="space-y-4" aria-labelledby="personality-flaws-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="personality-flaws-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.personality.flawsHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => flawsArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.personality.addFlaw")}
          </Button>
        </div>
        {flawsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.personality.flawsEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {flawsArray.fields.map((field, index) => {
              const rowErrors = errors.flaws?.[index] as SingleLineRowErrors;
              const bgStored =
                (flawsWatched[index]?.background ?? "").trim();
              const rowKey = `flaw-${field.id}`;
              const showBg =
                bgStored !== "" || backgroundRevealedIds.has(rowKey);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.personality.flawLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => flawsArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.personality.removeFlawAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldGroup
                        id={`flaws-${field.id}-text`}
                        label={t("fields.personality.flawField")}
                      >
                      <Input
                        id={`flaws-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `flaws-${field.id}-text-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`flaws.${index}.text`)}
                      />
                      {rowErrors?.text ? (
                        <FieldError
                          id={`flaws-${field.id}-text-error`}
                          message={rowErrors.text.message}
                        />
                      ) : null}
                      </FieldGroup>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        {t("common.addBackground")}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <FieldGroup
                          id={`flaws-${field.id}-background`}
                          label={t("fields.personality.backgroundLabel")}
                        >
                          <Textarea
                            id={`flaws-${field.id}-background`}
                            autoComplete="off"
                            rows={3}
                            placeholder={t("fields.personality.flawBgPlaceholder")}
                            aria-invalid={
                              rowErrors?.background ? true : undefined
                            }
                            aria-describedby={
                              rowErrors?.background
                                ? `flaws-${field.id}-background-error`
                                : undefined
                            }
                            className={cn(textareaFieldClassName)}
                            {...register(`flaws.${index}.background`)}
                          />
                          {rowErrors?.background ? (
                            <FieldError
                              id={`flaws-${field.id}-background-error`}
                              message={rowErrors.background.message}
                            />
                          ) : null}
                        </FieldGroup>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="personality-fears-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="personality-fears-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.personality.fearsHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              fearsArray.append({
                description: "",
                level: "leve",
                background: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.personality.addFear")}
          </Button>
        </div>
        {fearsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.personality.fearsEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {fearsArray.fields.map((field, index) => {
              const rowErrors = errors.fears?.[index] as FearRowErrors;
              const bgStored =
                (fearsWatched[index]?.background ?? "").trim();
              const rowKey = `fear-${field.id}`;
              const showBg =
                bgStored !== "" || backgroundRevealedIds.has(rowKey);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.personality.fearLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => fearsArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.personality.removeFearAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`fears-${field.id}-description`}
                      label={t("fields.personality.fearDescription")}
                    >
                      <Input
                        id={`fears-${field.id}-description`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={
                          rowErrors?.description ? true : undefined
                        }
                        aria-describedby={
                          rowErrors?.description
                            ? `fears-${field.id}-description-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`fears.${index}.description`)}
                      />
                      {rowErrors?.description ? (
                        <FieldError
                          id={`fears-${field.id}-description-error`}
                          message={rowErrors.description.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <FieldGroup
                      id={`fears-${field.id}-level`}
                      label={t("fields.personality.intensity")}
                    >
                      <RhfEnumStringSelect
                        control={control}
                        name={`fears.${index}.level`}
                        id={`fears-${field.id}-level`}
                        options={PERSONALITY_FEAR_LEVELS}
                        optionLabel={(lvl) =>
                          t(`document.fearLevels.${lvl}`) || lvl
                        }
                        aria-invalid={rowErrors?.level ? true : undefined}
                        aria-describedby={
                          rowErrors?.level
                            ? `fears-${field.id}-level-error`
                            : undefined
                        }
                      />
                      {rowErrors?.level ? (
                        <FieldError
                          id={`fears-${field.id}-level-error`}
                          message={rowErrors.level.message}
                        />
                      ) : null}
                    </FieldGroup>
                  </div>
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        {t("common.addBackground")}
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`fears-${field.id}-background`}
                        label={t("fields.personality.backgroundLabel")}
                      >
                        <Textarea
                          id={`fears-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder={t("fields.personality.fearBgPlaceholder")}
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `fears-${field.id}-background-error`
                              : undefined
                          }
                          className={cn(textareaFieldClassName)}
                          {...register(`fears.${index}.background`)}
                        />
                        {rowErrors?.background ? (
                          <FieldError
                            id={`fears-${field.id}-background-error`}
                            message={rowErrors.background.message}
                          />
                        ) : null}
                      </FieldGroup>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="personality-habits-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="personality-habits-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.personality.habitsHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => habitsArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.personality.addHabit")}
          </Button>
        </div>
        {habitsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.personality.habitsEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {habitsArray.fields.map((field, index) => {
              const rowErrors = errors.habits?.[index] as SingleLineRowErrors;
              const bgStored =
                (habitsWatched[index]?.background ?? "").trim();
              const rowKey = `habit-${field.id}`;
              const showBg =
                bgStored !== "" || backgroundRevealedIds.has(rowKey);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.personality.habitLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => habitsArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.personality.removeHabitAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldGroup
                        id={`habits-${field.id}-text`}
                        label={t("fields.personality.habitField")}
                      >
                      <Input
                        id={`habits-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `habits-${field.id}-text-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`habits.${index}.text`)}
                      />
                      {rowErrors?.text ? (
                        <FieldError
                          id={`habits-${field.id}-text-error`}
                          message={rowErrors.text.message}
                        />
                      ) : null}
                      </FieldGroup>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        {t("common.addBackground")}
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`habits-${field.id}-background`}
                        label={t("fields.personality.backgroundLabel")}
                      >
                        <Textarea
                          id={`habits-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder={t("fields.personality.habitBgPlaceholder")}
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `habits-${field.id}-background-error`
                              : undefined
                          }
                          className={cn(textareaFieldClassName)}
                          {...register(`habits.${index}.background`)}
                        />
                        {rowErrors?.background ? (
                          <FieldError
                            id={`habits-${field.id}-background-error`}
                            message={rowErrors.background.message}
                          />
                        ) : null}
                      </FieldGroup>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="personality-quirks-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="personality-quirks-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t("fields.personality.quirksHeading")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => quirksArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            {t("fields.personality.addQuirk")}
          </Button>
        </div>
        {quirksArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            {t("fields.personality.quirksEmpty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {quirksArray.fields.map((field, index) => {
              const rowErrors = errors.quirks?.[index] as SingleLineRowErrors;
              const bgStored =
                (quirksWatched[index]?.background ?? "").trim();
              const rowKey = `quirk-${field.id}`;
              const showBg =
                bgStored !== "" || backgroundRevealedIds.has(rowKey);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {formatMessage(t("fields.personality.quirkLabel"), {
                        n: index + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => quirksArray.remove(index)}
                      aria-label={formatMessage(
                        t("fields.personality.removeQuirkAria"),
                        { n: index + 1 },
                      )}
                    >
                      <Trash2 className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldGroup
                        id={`quirks-${field.id}-text`}
                        label={t("fields.personality.quirkField")}
                      >
                      <Input
                        id={`quirks-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `quirks-${field.id}-text-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`quirks.${index}.text`)}
                      />
                      {rowErrors?.text ? (
                        <FieldError
                          id={`quirks-${field.id}-text-error`}
                          message={rowErrors.text.message}
                        />
                      ) : null}
                      </FieldGroup>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        {t("common.addBackground")}
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`quirks-${field.id}-background`}
                        label={t("fields.personality.backgroundLabel")}
                      >
                        <Textarea
                          id={`quirks-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder={t("fields.personality.quirkBgPlaceholder")}
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `quirks-${field.id}-background-error`
                              : undefined
                          }
                          className={cn(textareaFieldClassName)}
                          {...register(`quirks.${index}.background`)}
                        />
                        {rowErrors?.background ? (
                          <FieldError
                            id={`quirks-${field.id}-background-error`}
                            message={rowErrors.background.message}
                          />
                        ) : null}
                      </FieldGroup>
                    )}
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
