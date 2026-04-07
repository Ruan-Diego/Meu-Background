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

export function BasicInfoFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldGroup id="characterName" label="Nome do personagem">
        <input
          id="characterName"
          type="text"
          autoComplete="off"
          aria-invalid={errors.characterName ? true : undefined}
          aria-describedby={
            errors.characterName ? "characterName-error" : undefined
          }
          className={inputClassName}
          {...register("characterName")}
        />
        {errors.characterName ? (
          <FieldError
            id="characterName-error"
            message={errors.characterName.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="playerName" label="Nome do jogador">
        <input
          id="playerName"
          type="text"
          autoComplete="name"
          aria-invalid={errors.playerName ? true : undefined}
          aria-describedby={
            errors.playerName ? "playerName-error" : undefined
          }
          className={inputClassName}
          {...register("playerName")}
        />
        {errors.playerName ? (
          <FieldError
            id="playerName-error"
            message={errors.playerName.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="age" label="Idade">
        <input
          id="age"
          type="text"
          inputMode="text"
          autoComplete="off"
          aria-invalid={errors.age ? true : undefined}
          aria-describedby={errors.age ? "age-error" : undefined}
          className={inputClassName}
          {...register("age")}
        />
        {errors.age ? (
          <FieldError id="age-error" message={errors.age.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="race" label="Raça">
        <input
          id="race"
          type="text"
          autoComplete="off"
          aria-invalid={errors.race ? true : undefined}
          aria-describedby={errors.race ? "race-error" : undefined}
          className={inputClassName}
          {...register("race")}
        />
        {errors.race ? (
          <FieldError id="race-error" message={errors.race.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="characterClass" label="Classe">
        <input
          id="characterClass"
          type="text"
          autoComplete="off"
          aria-invalid={errors.characterClass ? true : undefined}
          aria-describedby={
            errors.characterClass ? "characterClass-error" : undefined
          }
          className={inputClassName}
          {...register("characterClass")}
        />
        {errors.characterClass ? (
          <FieldError
            id="characterClass-error"
            message={errors.characterClass.message}
          />
        ) : null}
      </FieldGroup>
    </div>
  );
}
