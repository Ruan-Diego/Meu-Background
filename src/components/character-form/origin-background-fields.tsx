"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

import {
  ORIGIN_COUNTRY_OPTIONS,
  ORIGIN_REGION_SUGGESTIONS,
} from "@/lib/character-form/origin-constants";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const REGION_LIST_ID = "origin-region-suggestions";

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

export function OriginBackgroundFields() {
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

  return (
    <div className="space-y-10">
      <section className="space-y-4" aria-labelledby="origin-location-heading">
        <h3
          id="origin-location-heading"
          className="text-sm font-semibold text-foreground"
        >
          Local de origem
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldGroup id="birthCountry" label="País">
            <select
              id="birthCountry"
              aria-invalid={errors.birthCountry ? true : undefined}
              aria-describedby={
                errors.birthCountry ? "birthCountry-error" : undefined
              }
              className={selectClassName}
              {...register("birthCountry")}
            >
              <option value="">Selecione…</option>
              {ORIGIN_COUNTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.birthCountry ? (
              <FieldError
                id="birthCountry-error"
                message={errors.birthCountry.message}
              />
            ) : null}
          </FieldGroup>

          <FieldGroup id="birthRegion" label="Região">
            <input
              id="birthRegion"
              type="text"
              list={REGION_LIST_ID}
              autoComplete="off"
              placeholder="Sugestões ou texto livre"
              aria-invalid={errors.birthRegion ? true : undefined}
              aria-describedby={
                errors.birthRegion ? "birthRegion-error" : undefined
              }
              className={inputClassName}
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
            <FieldGroup id="birthCity" label="Cidade">
              <input
                id="birthCity"
                type="text"
                autoComplete="off"
                aria-invalid={errors.birthCity ? true : undefined}
                aria-describedby={
                  errors.birthCity ? "birthCity-error" : undefined
                }
                className={inputClassName}
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
            Parentes e vínculos
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
            Adicionar parente
          </Button>
        </div>

        {relativesArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum parente adicionado. Use o botão acima para incluir mãe, pai,
            tios ou outros vínculos.
          </p>
        ) : (
          <ul className="space-y-4">
            {relativesArray.fields.map((field, index) => {
              const rowErrors = errors.relatives?.[index];
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      Parente {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => relativesArray.remove(index)}
                      aria-label={`Remover parente ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`relatives-${field.id}-kinship`}
                      label="Parentesco"
                    >
                      <input
                        id={`relatives-${field.id}-kinship`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.kinship ? true : undefined}
                        aria-describedby={
                          rowErrors?.kinship
                            ? `relatives-${field.id}-kinship-error`
                            : undefined
                        }
                        className={inputClassName}
                        {...register(`relatives.${index}.kinship`)}
                      />
                      {rowErrors?.kinship ? (
                        <FieldError
                          id={`relatives-${field.id}-kinship-error`}
                          message={rowErrors.kinship.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <FieldGroup id={`relatives-${field.id}-name`} label="Nome">
                      <input
                        id={`relatives-${field.id}-name`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.name ? true : undefined}
                        aria-describedby={
                          rowErrors?.name
                            ? `relatives-${field.id}-name-error`
                            : undefined
                        }
                        className={inputClassName}
                        {...register(`relatives.${index}.name`)}
                      />
                      {rowErrors?.name ? (
                        <FieldError
                          id={`relatives-${field.id}-name-error`}
                          message={rowErrors.name.message}
                        />
                      ) : null}
                    </FieldGroup>
                    <div className="sm:col-span-2">
                      <FieldGroup
                        id={`relatives-${field.id}-background`}
                        label="Background (opcional)"
                      >
                        <input
                          id={`relatives-${field.id}-background`}
                          type="text"
                          autoComplete="off"
                          aria-invalid={
                            rowErrors?.background ? true : undefined
                          }
                          aria-describedby={
                            rowErrors?.background
                              ? `relatives-${field.id}-background-error`
                              : undefined
                          }
                          className={inputClassName}
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
            Eventos marcantes
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
            Adicionar evento
          </Button>
        </div>

        {eventsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum evento adicionado. Inclua momentos que moldaram o personagem.
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
                      Evento {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => eventsArray.remove(index)}
                      aria-label={`Remover evento ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                      id={`shapingEvents-${field.id}-eventName`}
                      label="Nome do evento"
                    >
                      <input
                        id={`shapingEvents-${field.id}-eventName`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.eventName ? true : undefined}
                        aria-describedby={
                          rowErrors?.eventName
                            ? `shapingEvents-${field.id}-eventName-error`
                            : undefined
                        }
                        className={inputClassName}
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
                      label="Minha idade"
                    >
                      <input
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
                        className={inputClassName}
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
                        label="Descrição"
                      >
                        <textarea
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
                          className={textareaClassName}
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

      <section aria-labelledby="origin-occupation-heading">
        <h3
          id="origin-occupation-heading"
          className="sr-only"
        >
          Ocupação
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldGroup id="occupation" label="Ocupação atual">
            <input
              id="occupation"
              type="text"
              autoComplete="off"
              aria-invalid={errors.occupation ? true : undefined}
              aria-describedby={
                errors.occupation ? "occupation-error" : undefined
              }
              className={inputClassName}
              {...register("occupation")}
            />
            {errors.occupation ? (
              <FieldError
                id="occupation-error"
                message={errors.occupation.message}
              />
            ) : null}
          </FieldGroup>
        </div>
      </section>
    </div>
  );
}
