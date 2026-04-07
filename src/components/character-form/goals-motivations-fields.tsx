"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { Button } from "@/components/ui/button";
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
                description: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar descrição
          </Button>
        </div>

        {shortTermArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhuma meta adicionada. Use o botão acima para incluir uma descrição.
          </p>
        ) : (
          <ul className="space-y-4">
            {shortTermArray.fields.map((field, index) => {
              const rowErrors = errors.shortTermGoals?.[index];
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
                  <FieldGroup
                    id={`shortTermGoals-${field.id}-description`}
                    label="Descrição"
                  >
                    <Textarea
                      id={`shortTermGoals-${field.id}-description`}
                      rows={4}
                      autoComplete="off"
                      aria-invalid={rowErrors?.description ? true : undefined}
                      aria-describedby={
                        rowErrors?.description
                          ? `shortTermGoals-${field.id}-description-error`
                          : undefined
                      }
                      className={cn(textareaFieldClassName)}
                      {...register(`shortTermGoals.${index}.description`)}
                    />
                    {rowErrors?.description ? (
                      <FieldError
                        id={`shortTermGoals-${field.id}-description-error`}
                        message={rowErrors.description.message}
                      />
                    ) : null}
                  </FieldGroup>
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
                description: "",
              })
            }
          >
            <Plus data-icon="inline-start" className="size-4" />
            Adicionar descrição
          </Button>
        </div>

        {lifeGoalsArray.fields.length === 0 ? (
          <p className="text-body text-muted-foreground">
            Nenhum objetivo de vida adicionado. Use o botão acima para incluir uma
            descrição.
          </p>
        ) : (
          <ul className="space-y-4">
            {lifeGoalsArray.fields.map((field, index) => {
              const rowErrors = errors.lifeGoals?.[index];
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
                  <FieldGroup
                    id={`lifeGoals-${field.id}-description`}
                    label="Descrição"
                  >
                    <Textarea
                      id={`lifeGoals-${field.id}-description`}
                      rows={4}
                      autoComplete="off"
                      aria-invalid={rowErrors?.description ? true : undefined}
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
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
