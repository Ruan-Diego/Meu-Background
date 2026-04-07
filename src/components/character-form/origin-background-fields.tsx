"use client";

import { useFormContext } from "react-hook-form";

import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
);

const textareaClassName = cn(
  inputClassName,
  "min-h-[120px] resize-y py-2"
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

export function OriginBackgroundFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldGroup id="birthplace" label="Lugar de nascimento / origem">
        <input
          id="birthplace"
          type="text"
          autoComplete="off"
          aria-invalid={errors.birthplace ? true : undefined}
          aria-describedby={
            errors.birthplace ? "birthplace-error" : undefined
          }
          className={inputClassName}
          {...register("birthplace")}
        />
        {errors.birthplace ? (
          <FieldError
            id="birthplace-error"
            message={errors.birthplace.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="occupation" label="Ocupação / profissão">
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

      <FieldGroup id="socialClass" label="Classe social">
        <input
          id="socialClass"
          type="text"
          autoComplete="off"
          aria-invalid={errors.socialClass ? true : undefined}
          aria-describedby={
            errors.socialClass ? "socialClass-error" : undefined
          }
          className={inputClassName}
          {...register("socialClass")}
        />
        {errors.socialClass ? (
          <FieldError
            id="socialClass-error"
            message={errors.socialClass.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="familyBackground" label="Família">
        <input
          id="familyBackground"
          type="text"
          autoComplete="off"
          aria-invalid={errors.familyBackground ? true : undefined}
          aria-describedby={
            errors.familyBackground ? "familyBackground-error" : undefined
          }
          className={inputClassName}
          {...register("familyBackground")}
        />
        {errors.familyBackground ? (
          <FieldError
            id="familyBackground-error"
            message={errors.familyBackground.message}
          />
        ) : null}
      </FieldGroup>

      <div className="sm:col-span-2">
        <FieldGroup id="formativeEvents" label="Eventos formativos">
          <textarea
            id="formativeEvents"
            rows={5}
            autoComplete="off"
            aria-invalid={errors.formativeEvents ? true : undefined}
            aria-describedby={
              errors.formativeEvents ? "formativeEvents-error" : undefined
            }
            className={textareaClassName}
            {...register("formativeEvents")}
          />
          {errors.formativeEvents ? (
            <FieldError
              id="formativeEvents-error"
              message={errors.formativeEvents.message}
            />
          ) : null}
        </FieldGroup>
      </div>
    </div>
  );
}
