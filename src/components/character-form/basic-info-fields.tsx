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
          <p
            id="characterName-error"
            role="alert"
            className="text-caption text-destructive"
          >
            {errors.characterName.message}
          </p>
        ) : null}
      </FieldGroup>

      <FieldGroup id="playerName" label="Nome do jogador">
        <input
          id="playerName"
          type="text"
          autoComplete="name"
          aria-invalid={errors.playerName ? true : undefined}
          className={inputClassName}
          {...register("playerName")}
        />
        {errors.playerName ? (
          <p role="alert" className="text-caption text-destructive">
            {errors.playerName.message}
          </p>
        ) : null}
      </FieldGroup>

      <FieldGroup id="rpgSystem" label="Sistema de RPG">
        <input
          id="rpgSystem"
          type="text"
          autoComplete="off"
          aria-invalid={errors.rpgSystem ? true : undefined}
          className={inputClassName}
          {...register("rpgSystem")}
        />
        {errors.rpgSystem ? (
          <p role="alert" className="text-caption text-destructive">
            {errors.rpgSystem.message}
          </p>
        ) : null}
      </FieldGroup>

      <FieldGroup id="campaignName" label="Nome da campanha">
        <input
          id="campaignName"
          type="text"
          autoComplete="off"
          aria-invalid={errors.campaignName ? true : undefined}
          className={inputClassName}
          {...register("campaignName")}
        />
        {errors.campaignName ? (
          <p role="alert" className="text-caption text-destructive">
            {errors.campaignName.message}
          </p>
        ) : null}
      </FieldGroup>

      <FieldGroup id="levelOrTier" label="Nível ou patamar">
        <input
          id="levelOrTier"
          type="text"
          autoComplete="off"
          aria-invalid={errors.levelOrTier ? true : undefined}
          className={inputClassName}
          {...register("levelOrTier")}
        />
        {errors.levelOrTier ? (
          <p role="alert" className="text-caption text-destructive">
            {errors.levelOrTier.message}
          </p>
        ) : null}
      </FieldGroup>
    </div>
  );
}
