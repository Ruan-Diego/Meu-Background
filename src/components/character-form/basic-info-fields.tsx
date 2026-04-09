"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  FieldError,
  FieldGroup,
  inputFieldClassName,
} from "@/components/character-form/form-field-parts";
import { Input } from "@/components/ui/input";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

export function BasicInfoFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CharacterFormValues>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldGroup id="characterName" label="Nome do personagem">
        <Controller
          name="characterName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="characterName"
              data-testid="character-name-input"
              type="text"
              autoComplete="off"
              aria-invalid={errors.characterName ? true : undefined}
              aria-describedby={
                errors.characterName ? "characterName-error" : undefined
              }
              className={cn(inputFieldClassName)}
            />
          )}
        />
        {errors.characterName ? (
          <FieldError
            id="characterName-error"
            message={errors.characterName.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="playerName" label="Nome do jogador">
        <Input
          id="playerName"
          type="text"
          autoComplete="name"
          aria-invalid={errors.playerName ? true : undefined}
          aria-describedby={
            errors.playerName ? "playerName-error" : undefined
          }
          className={cn(inputFieldClassName)}
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
        <Input
          id="age"
          type="text"
          inputMode="text"
          autoComplete="off"
          aria-invalid={errors.age ? true : undefined}
          aria-describedby={errors.age ? "age-error" : undefined}
          className={cn(inputFieldClassName)}
          {...register("age")}
        />
        {errors.age ? (
          <FieldError id="age-error" message={errors.age.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="race" label="Raça">
        <Input
          id="race"
          type="text"
          autoComplete="off"
          aria-invalid={errors.race ? true : undefined}
          aria-describedby={errors.race ? "race-error" : undefined}
          className={cn(inputFieldClassName)}
          {...register("race")}
        />
        {errors.race ? (
          <FieldError id="race-error" message={errors.race.message} />
        ) : null}
      </FieldGroup>

      <FieldGroup id="characterClass" label="Classe">
        <Input
          id="characterClass"
          type="text"
          autoComplete="off"
          aria-invalid={errors.characterClass ? true : undefined}
          aria-describedby={
            errors.characterClass ? "characterClass-error" : undefined
          }
          className={cn(inputFieldClassName)}
          {...register("characterClass")}
        />
        {errors.characterClass ? (
          <FieldError
            id="characterClass-error"
            message={errors.characterClass.message}
          />
        ) : null}
      </FieldGroup>

      <FieldGroup id="occupation" label="Ocupação atual">
        <Input
          id="occupation"
          type="text"
          autoComplete="off"
          aria-invalid={errors.occupation ? true : undefined}
          aria-describedby={
            errors.occupation ? "occupation-error" : undefined
          }
          className={cn(inputFieldClassName)}
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
  );
}
