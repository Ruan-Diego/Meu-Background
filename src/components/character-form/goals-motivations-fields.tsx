"use client";

import { useFormContext } from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

export function GoalsMotivationsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  return (
    <div className="space-y-8">
      <FieldGroup id="shortTermGoals" label="Metas de curto prazo">
        <Textarea
          id="shortTermGoals"
          autoComplete="off"
          aria-invalid={errors.shortTermGoals ? true : undefined}
          aria-describedby={
            errors.shortTermGoals ? "shortTermGoals-error" : undefined
          }
          className={cn(textareaFieldClassName)}
          {...register("shortTermGoals")}
        />
        {errors.shortTermGoals ? (
          <FieldError
            id="shortTermGoals-error"
            message={errors.shortTermGoals.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="longTermAmbitions" label="Ambições de longo prazo">
        <Textarea
          id="longTermAmbitions"
          autoComplete="off"
          aria-invalid={errors.longTermAmbitions ? true : undefined}
          aria-describedby={
            errors.longTermAmbitions ? "longTermAmbitions-error" : undefined
          }
          className={cn(textareaFieldClassName)}
          {...register("longTermAmbitions")}
        />
        {errors.longTermAmbitions ? (
          <FieldError
            id="longTermAmbitions-error"
            message={errors.longTermAmbitions.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="secrets" label="Segredos">
        <Textarea
          id="secrets"
          autoComplete="off"
          aria-invalid={errors.secrets ? true : undefined}
          aria-describedby={errors.secrets ? "secrets-error" : undefined}
          className={cn(textareaFieldClassName)}
          {...register("secrets")}
        />
        {errors.secrets ? (
          <FieldError id="secrets-error" message={errors.secrets.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="moralDilemmas" label="Dilemas morais">
        <Textarea
          id="moralDilemmas"
          autoComplete="off"
          aria-invalid={errors.moralDilemmas ? true : undefined}
          aria-describedby={
            errors.moralDilemmas ? "moralDilemmas-error" : undefined
          }
          className={cn(textareaFieldClassName)}
          {...register("moralDilemmas")}
        />
        {errors.moralDilemmas ? (
          <FieldError
            id="moralDilemmas-error"
            message={errors.moralDilemmas.message}
          />
        ) : null}
      </FieldGroup>
    </div>
  );
}
