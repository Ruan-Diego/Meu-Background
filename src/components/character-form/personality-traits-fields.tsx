"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
  type FieldErrors,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import {
  PERSONALITY_FEAR_LEVEL_LABELS,
  PERSONALITY_FEAR_LEVELS,
  TEMPERAMENT_CHIP_OPTIONS,
  VALUES_CHIP_OPTIONS,
} from "@/lib/character-form/personality-constants";
import { cn } from "@/lib/utils";

const VALUE_PRESET_SET = new Set<string>(VALUES_CHIP_OPTIONS);
const TEMPERAMENT_PRESET_SET = new Set<string>(TEMPERAMENT_CHIP_OPTIONS);

const inputClassName = cn(
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
);

const selectClassName = cn(inputClassName, "cursor-pointer");

const textareaClassName = cn(
  inputClassName,
  "min-h-[88px] resize-y py-2"
);

function FieldGroup({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-caption font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role="alert" className="text-caption text-destructive">
      {message ?? "Verifique este campo."}
    </p>
  );
}

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
    <button
      type="button"
      id={safeId}
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-ring hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function CustomTagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-0.5 rounded-full border border-primary bg-primary/15 py-1 pl-3 pr-1 text-sm font-medium text-foreground"
      )}
    >
      <button
        type="button"
        className="min-w-0 truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        onClick={onRemove}
        aria-label={`Remover ${label}`}
      >
        {label}
      </button>
      <button
        type="button"
        className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-background/80 hover:text-foreground"
        aria-label={`Remover chip ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </span>
  );
}

function ChipPickerSection({
  presets,
  presetSet,
  tags,
  ariaLabel,
  onTogglePreset,
  onRemoveCustom,
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
  onTogglePreset: (label: string) => void;
  onRemoveCustom: (label: string) => void;
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
            label={opt}
            selected={tags.includes(opt)}
            onToggle={() => onTogglePreset(opt)}
          />
        ))}
        {customTags.map((tag) => (
          <CustomTagChip
            key={tag}
            label={tag}
            onRemove={() => onRemoveCustom(tag)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <FieldGroup id={inputId} label={inputLabel}>
          <input
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
            className={inputClassName}
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
  const {
    register,
    control,
    setValue,
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
      const current =
        field === "temperamentTags" ? temperamentTags : valueTags;
      const next = current.includes(label)
        ? current.filter((t) => t !== label)
        : [...current, label];
      setValue(field, next, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue, temperamentTags, valueTags]
  );

  const removeFromList = useCallback(
    (field: "temperamentTags" | "valueTags", label: string) => {
      const current =
        field === "temperamentTags" ? temperamentTags : valueTags;
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
    [setValue, temperamentTags, valueTags]
  );

  const addCustomToList = useCallback(
    (
      field: "temperamentTags" | "valueTags",
      draft: string,
      clearDraft: () => void
    ) => {
      const trimmed = draft.trim();
      if (!trimmed) return;
      const current = field === "temperamentTags" ? temperamentTags : valueTags;
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
    [setValue, temperamentTags, valueTags]
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
          Temperamento
        </h3>
        <p className="text-body text-muted-foreground">
          Escolha sugestões ou inclua chips livres. Clique num chip personalizado
          ou no X para remover.
        </p>
        <ChipPickerSection
          presets={TEMPERAMENT_CHIP_OPTIONS}
          presetSet={TEMPERAMENT_PRESET_SET}
          tags={temperamentTags}
          ariaLabel="Temperamento"
          onTogglePreset={(opt) => toggleInList("temperamentTags", opt)}
          onRemoveCustom={(tag) => removeFromList("temperamentTags", tag)}
          draft={customTemperamentDraft}
          onDraftChange={setCustomTemperamentDraft}
          onAddCustom={() =>
            addCustomToList(
              "temperamentTags",
              customTemperamentDraft,
              () => setCustomTemperamentDraft("")
            )
          }
          addButtonLabel="Incluir chip"
          inputId="custom-temperament-input"
          inputLabel="Adicionar temperamento"
        />
      </section>

      <section className="space-y-4" aria-labelledby="personality-values-heading">
        <h3
          id="personality-values-heading"
          className="text-sm font-semibold text-foreground"
        >
          Valores
        </h3>
        <p className="text-body text-muted-foreground">
          Marque o que importa e adicione valores livres. Chips extras têm X;
          também pode clicar no texto para remover.
        </p>
        <ChipPickerSection
          presets={VALUES_CHIP_OPTIONS}
          presetSet={VALUE_PRESET_SET}
          tags={valueTags}
          ariaLabel="Valores"
          onTogglePreset={(opt) => toggleInList("valueTags", opt)}
          onRemoveCustom={(tag) => removeFromList("valueTags", tag)}
          draft={customValueDraft}
          onDraftChange={setCustomValueDraft}
          onAddCustom={() =>
            addCustomToList("valueTags", customValueDraft, () =>
              setCustomValueDraft("")
            )
          }
          addButtonLabel="Incluir chip"
          inputId="custom-value-input"
          inputLabel="Adicionar valor"
        />
      </section>

      <section className="space-y-4" aria-labelledby="personality-flaws-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="personality-flaws-heading"
            className="text-sm font-semibold text-foreground"
          >
            Fraquezas
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => flawsArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar fraqueza
          </Button>
        </div>
        {flawsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhuma fraqueza adicionada. Inclua pontos fracos, vícios ou limitações.
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
                      Fraqueza {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => flawsArray.remove(index)}
                      aria-label={`Remover fraqueza ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup id={`flaws-${field.id}-text`} label="Fraqueza">
                      <input
                        id={`flaws-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `flaws-${field.id}-text-error`
                            : undefined
                        }
                        className={inputClassName}
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
                  <div className="mt-4 sm:col-span-2 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        Adicionar background
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <FieldGroup
                          id={`flaws-${field.id}-background`}
                          label="Background"
                        >
                          <textarea
                            id={`flaws-${field.id}-background`}
                            autoComplete="off"
                            rows={3}
                            placeholder="Qual o motivo da sua fraqueza?"
                            aria-invalid={
                              rowErrors?.background ? true : undefined
                            }
                            aria-describedby={
                              rowErrors?.background
                                ? `flaws-${field.id}-background-error`
                                : undefined
                            }
                            className={textareaClassName}
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
            Medos
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
            Adicionar medo
          </Button>
        </div>
        {fearsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum medo adicionado. Descreva o medo e a intensidade para cada um.
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
                      Medo {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => fearsArray.remove(index)}
                      aria-label={`Remover medo ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`fears-${field.id}-description`}
                      label="Medo"
                    >
                      <input
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
                        className={inputClassName}
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
                      label="Intensidade"
                    >
                      <select
                        id={`fears-${field.id}-level`}
                        aria-invalid={rowErrors?.level ? true : undefined}
                        aria-describedby={
                          rowErrors?.level
                            ? `fears-${field.id}-level-error`
                            : undefined
                        }
                        className={selectClassName}
                        {...register(`fears.${index}.level`)}
                      >
                        {PERSONALITY_FEAR_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {PERSONALITY_FEAR_LEVEL_LABELS[lvl]}
                          </option>
                        ))}
                      </select>
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
                        Adicionar background
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`fears-${field.id}-background`}
                        label="Background"
                      >
                        <textarea
                          id={`fears-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder="Qual o motivo do seu medo?"
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `fears-${field.id}-background-error`
                              : undefined
                          }
                          className={textareaClassName}
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
            Hábitos
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => habitsArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar hábito
          </Button>
        </div>
        {habitsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum hábito adicionado. Rotinas, manias ou costumes do personagem.
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
                      Hábito {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => habitsArray.remove(index)}
                      aria-label={`Remover hábito ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup id={`habits-${field.id}-text`} label="Hábito">
                      <input
                        id={`habits-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `habits-${field.id}-text-error`
                            : undefined
                        }
                        className={inputClassName}
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
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        Adicionar background
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`habits-${field.id}-background`}
                        label="Background"
                      >
                        <textarea
                          id={`habits-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder="Qual o motivo do seu hábito?"
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `habits-${field.id}-background-error`
                              : undefined
                          }
                          className={textareaClassName}
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
            Peculiaridades
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => quirksArray.append({ text: "", background: "" })}
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar peculiaridade
          </Button>
        </div>
        {quirksArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhuma peculiaridade adicionada. Trejeitos, frases de efeito ou detalhes únicos.
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
                      Peculiaridade {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => quirksArray.remove(index)}
                      aria-label={`Remover peculiaridade ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`quirks-${field.id}-text`}
                      label="Peculiaridade"
                    >
                      <input
                        id={`quirks-${field.id}-text`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.text ? true : undefined}
                        aria-describedby={
                          rowErrors?.text
                            ? `quirks-${field.id}-text-error`
                            : undefined
                        }
                        className={inputClassName}
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
                  <div className="mt-4 space-y-2">
                    {!showBg ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => revealBackground(rowKey)}
                      >
                        Adicionar background
                      </Button>
                    ) : (
                      <FieldGroup
                        id={`quirks-${field.id}-background`}
                        label="Background"
                      >
                        <textarea
                          id={`quirks-${field.id}-background`}
                          autoComplete="off"
                          rows={3}
                          placeholder="Qual o motivo da sua peculiaridade?"
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `quirks-${field.id}-background-error`
                              : undefined
                          }
                          className={textareaClassName}
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
