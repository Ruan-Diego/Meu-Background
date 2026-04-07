"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  inputFieldClassName,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

export function GoalsMotivationsFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  const shortTermArray = useFieldArray({
    control,
    name: "shortTermGoals",
  });

  const lifeGoalsArray = useFieldArray({
    control,
    name: "lifeGoals",
  });

  const shortTermWatched = useWatch({ control, name: "shortTermGoals" }) ?? [];
  const lifeGoalsWatched = useWatch({ control, name: "lifeGoals" }) ?? [];

  const [metaDescRevealedIds, setMetaDescRevealedIds] = useState(
    () => new Set<string>()
  );
  const [lifeDescRevealedIds, setLifeDescRevealedIds] = useState(
    () => new Set<string>()
  );

  const revealMetaDescription = useCallback((rowId: string) => {
    setMetaDescRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(rowId);
      return next;
    });
  }, []);

  const revealLifeDescription = useCallback((rowId: string) => {
    setLifeDescRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(rowId);
      return next;
    });
  }, []);

  return (
    <div className="space-y-10">
      <section className="space-y-4" aria-labelledby="goals-metas-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="goals-metas-heading"
            className="text-sm font-semibold text-foreground"
          >
            Metas
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              shortTermArray.append({
                meta: "",
                description: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar meta
          </Button>
        </div>

        {shortTermArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhuma meta adicionada. Use o botão acima para incluir.
          </p>
        ) : (
          <ul className="space-y-4">
            {shortTermArray.fields.map((field, index) => {
              const rowErrors = errors.shortTermGoals?.[index];
              const descStored = (
                shortTermWatched[index]?.description ?? ""
              ).trim();
              const showDescription =
                descStored !== "" || metaDescRevealedIds.has(field.id);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      Meta {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => shortTermArray.remove(index)}
                      aria-label={`Remover meta ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FieldGroup
                      id={`shortTermGoals-${field.id}-meta`}
                      label="Meta"
                    >
                      <Input
                        id={`shortTermGoals-${field.id}-meta`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={rowErrors?.meta ? true : undefined}
                        aria-describedby={
                          rowErrors?.meta
                            ? `shortTermGoals-${field.id}-meta-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`shortTermGoals.${index}.meta`)}
                      />
                      {rowErrors?.meta ? (
                        <FieldError
                          id={`shortTermGoals-${field.id}-meta-error`}
                          message={rowErrors.meta.message}
                        />
                      ) : null}
                    </FieldGroup>

                    <div className="space-y-2">
                      {!showDescription ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit"
                          onClick={() => revealMetaDescription(field.id)}
                        >
                          Adicionar descrição
                        </Button>
                      ) : null}
                      <div
                        className={showDescription ? "space-y-2" : "hidden"}
                      >
                        <FieldGroup
                          id={`shortTermGoals-${field.id}-description`}
                          label="Descrição"
                        >
                          <Textarea
                            id={`shortTermGoals-${field.id}-description`}
                            rows={4}
                            autoComplete="off"
                            aria-invalid={
                              rowErrors?.description ? true : undefined
                            }
                            aria-describedby={
                              rowErrors?.description
                                ? `shortTermGoals-${field.id}-description-error`
                                : undefined
                            }
                            className={cn(textareaFieldClassName)}
                            {...register(
                              `shortTermGoals.${index}.description`
                            )}
                          />
                          {rowErrors?.description ? (
                            <FieldError
                              id={`shortTermGoals-${field.id}-description-error`}
                              message={rowErrors.description.message}
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

      <section className="space-y-4" aria-labelledby="goals-life-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3
            id="goals-life-heading"
            className="text-sm font-semibold text-foreground"
          >
            Objetivo de vida
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              lifeGoalsArray.append({
                objective: "",
                description: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar objetivo
          </Button>
        </div>

        {lifeGoalsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum objetivo adicionado. Use o botão acima para incluir.
          </p>
        ) : (
          <ul className="space-y-4">
            {lifeGoalsArray.fields.map((field, index) => {
              const rowErrors = errors.lifeGoals?.[index];
              const descStored = (
                lifeGoalsWatched[index]?.description ?? ""
              ).trim();
              const showDescription =
                descStored !== "" || lifeDescRevealedIds.has(field.id);
              return (
                <li
                  key={field.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      Objetivo {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => lifeGoalsArray.remove(index)}
                      aria-label={`Remover objetivo de vida ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remover
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FieldGroup
                      id={`lifeGoals-${field.id}-objective`}
                      label="Objetivo"
                    >
                      <Input
                        id={`lifeGoals-${field.id}-objective`}
                        type="text"
                        autoComplete="off"
                        aria-invalid={
                          rowErrors?.objective ? true : undefined
                        }
                        aria-describedby={
                          rowErrors?.objective
                            ? `lifeGoals-${field.id}-objective-error`
                            : undefined
                        }
                        className={cn(inputFieldClassName)}
                        {...register(`lifeGoals.${index}.objective`)}
                      />
                      {rowErrors?.objective ? (
                        <FieldError
                          id={`lifeGoals-${field.id}-objective-error`}
                          message={rowErrors.objective.message}
                        />
                      ) : null}
                    </FieldGroup>

                    <div className="space-y-2">
                      {!showDescription ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit"
                          onClick={() => revealLifeDescription(field.id)}
                        >
                          Adicionar descrição
                        </Button>
                      ) : null}
                      <div
                        className={showDescription ? "space-y-2" : "hidden"}
                      >
                        <FieldGroup
                          id={`lifeGoals-${field.id}-description`}
                          label="Descrição"
                        >
                          <Textarea
                            id={`lifeGoals-${field.id}-description`}
                            rows={4}
                            autoComplete="off"
                            aria-invalid={
                              rowErrors?.description ? true : undefined
                            }
                            aria-describedby={
                              rowErrors?.description
                                ? `lifeGoals-${field.id}-description-error`
                                : undefined
                            }
                            className={cn(textareaFieldClassName)}
                            {...register(`lifeGoals.${index}.description`)}
                          />
                          {rowErrors?.description ? (
                            <FieldError
                              id={`lifeGoals-${field.id}-description-error`}
                              message={rowErrors.description.message}
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
    </div>
  );
}
