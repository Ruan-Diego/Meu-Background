"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

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

function ChipToggle({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const id = `chip-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <button
      type="button"
      id={id}
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

  const [customValueDraft, setCustomValueDraft] = useState("");

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

  const addCustomValue = useCallback(() => {
    const trimmed = customValueDraft.trim();
    if (!trimmed) return;
    if (valueTags.includes(trimmed)) {
      setCustomValueDraft("");
      return;
    }
    setValue("valueTags", [...valueTags, trimmed], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCustomValueDraft("");
  }, [customValueDraft, setValue, valueTags]);

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
          Escolha uma ou mais sugestões. Você pode complementar abaixo.
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Sugestões de temperamento"
        >
          {TEMPERAMENT_CHIP_OPTIONS.map((opt) => (
            <ChipToggle
              key={opt}
              label={opt}
              selected={temperamentTags.includes(opt)}
              onToggle={() => toggleInList("temperamentTags", opt)}
            />
          ))}
        </div>
        <FieldGroup id="temperamentNotes" label="Quer acrescentar?">
          <textarea
            id="temperamentNotes"
            autoComplete="off"
            rows={3}
            aria-invalid={errors.temperamentNotes ? true : undefined}
            aria-describedby={
              errors.temperamentNotes ? "temperamentNotes-error" : undefined
            }
            className={textareaClassName}
            {...register("temperamentNotes")}
          />
          {errors.temperamentNotes ? (
            <FieldError
              id="temperamentNotes-error"
              message={errors.temperamentNotes.message}
            />
          ) : null}
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="personality-values-heading">
        <h3
          id="personality-values-heading"
          className="text-sm font-semibold text-foreground"
        >
          Valores
        </h3>
        <p className="text-body text-muted-foreground">
          Marque o que importa para o personagem e adicione outros valores livres.
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Sugestões de valores"
        >
          {VALUES_CHIP_OPTIONS.map((opt) => (
            <ChipToggle
              key={opt}
              label={opt}
              selected={valueTags.includes(opt)}
              onToggle={() => toggleInList("valueTags", opt)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <FieldGroup id="custom-value-input" label="Adicionar valor">
            <input
              id="custom-value-input"
              type="text"
              autoComplete="off"
              value={customValueDraft}
              onChange={(e) => setCustomValueDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomValue();
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
            onClick={addCustomValue}
          >
            <Plus data-icon="inline-start" className="size-4" />
            Incluir chip
          </Button>
        </div>
        {valueTags.some((t) => !VALUE_PRESET_SET.has(t)) ? (
          <div className="space-y-2">
            <p className="text-caption font-medium text-muted-foreground">
              Valores adicionados
            </p>
            <div className="flex flex-wrap gap-2">
              {valueTags
                .filter((t) => !VALUE_PRESET_SET.has(t))
                .map((tag) => (
                  <ChipToggle
                    key={tag}
                    label={tag}
                    selected
                    onToggle={() => toggleInList("valueTags", tag)}
                  />
                ))}
            </div>
            <p className="text-caption text-muted-foreground">
              Clique no chip para remover.
            </p>
          </div>
        ) : null}
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
            onClick={() => flawsArray.append({ text: "" })}
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
              const rowErrors = errors.flaws?.[index];
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
                  <FieldGroup id={`flaws-${field.id}-text`} label="Descrição">
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
              fearsArray.append({ description: "", level: "leve" })
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
              const rowErrors = errors.fears?.[index];
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
            onClick={() => habitsArray.append({ text: "" })}
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
              const rowErrors = errors.habits?.[index];
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
                  <FieldGroup id={`habits-${field.id}-text`} label="Descrição">
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
            onClick={() => quirksArray.append({ text: "" })}
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
              const rowErrors = errors.quirks?.[index];
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
                  <FieldGroup id={`quirks-${field.id}-text`} label="Descrição">
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
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
