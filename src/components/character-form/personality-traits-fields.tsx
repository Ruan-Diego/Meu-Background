"use client";

import { useFormContext } from "react-hook-form";

import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

const textareaClassName = cn(
  "flex min-h-[88px] w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
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

export function PersonalityTraitsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldGroup id="temperament" label="Temperamento">
        <textarea
          id="temperament"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.temperament ? true : undefined}
          aria-describedby={
            errors.temperament ? "temperament-error" : undefined
          }
          className={textareaClassName}
          {...register("temperament")}
        />
        {errors.temperament ? (
          <FieldError
            id="temperament-error"
            message={errors.temperament.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="values" label="Valores">
        <textarea
          id="values"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.values ? true : undefined}
          aria-describedby={errors.values ? "values-error" : undefined}
          className={textareaClassName}
          {...register("values")}
        />
        {errors.values ? (
          <FieldError id="values-error" message={errors.values.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="flaws" label="Fraquezas">
        <textarea
          id="flaws"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.flaws ? true : undefined}
          aria-describedby={errors.flaws ? "flaws-error" : undefined}
          className={textareaClassName}
          {...register("flaws")}
        />
        {errors.flaws ? (
          <FieldError id="flaws-error" message={errors.flaws.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="fears" label="Medos">
        <textarea
          id="fears"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.fears ? true : undefined}
          aria-describedby={errors.fears ? "fears-error" : undefined}
          className={textareaClassName}
          {...register("fears")}
        />
        {errors.fears ? (
          <FieldError id="fears-error" message={errors.fears.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="habits" label="Hábitos">
        <textarea
          id="habits"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.habits ? true : undefined}
          aria-describedby={errors.habits ? "habits-error" : undefined}
          className={textareaClassName}
          {...register("habits")}
        />
        {errors.habits ? (
          <FieldError id="habits-error" message={errors.habits.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="quirks" label="Peculiaridades">
        <textarea
          id="quirks"
          autoComplete="off"
          rows={4}
          aria-invalid={errors.quirks ? true : undefined}
          aria-describedby={errors.quirks ? "quirks-error" : undefined}
          className={textareaClassName}
          {...register("quirks")}
        />
        {errors.quirks ? (
          <FieldError id="quirks-error" message={errors.quirks.message} />
        ) : null}
      </FieldGroup>
    </div>
  );
}
