import { z } from "zod";

import { ORIGIN_COUNTRY_OPTIONS } from "@/lib/character-form/origin-constants";
import { PERSONALITY_FEAR_LEVELS } from "@/lib/character-form/personality-constants";
import { FORM_STEPS, type FormStepId } from "@/lib/character-form/steps";

const trimmed = z.string().trim();

const originCountrySchema = z.union([
  z.literal(""),
  z.enum(ORIGIN_COUNTRY_OPTIONS),
]);

const relativeRowSchema = z.object({
  kinship: trimmed,
  name: trimmed,
  background: trimmed,
});

const shapingEventRowSchema = z.object({
  eventName: trimmed,
  myAge: trimmed,
  description: trimmed,
});

const personalitySingleLineRowSchema = z.object({
  text: trimmed,
});

const personalityFearRowSchema = z.object({
  description: trimmed,
  level: z.enum(PERSONALITY_FEAR_LEVELS),
});

/**
 * Single source of truth for the character form. Further steps add fields
 * in M1-F05+ and register keys under the matching step in `STEP_FIELD_PATHS`.
 */
export const characterFormSchema = z.object({
  characterName: trimmed.min(1, "Informe o nome do personagem."),
  playerName: trimmed,
  age: trimmed,
  race: trimmed,
  characterClass: trimmed,
  birthCountry: originCountrySchema,
  birthRegion: trimmed,
  birthCity: trimmed,
  relatives: z.array(relativeRowSchema),
  shapingEvents: z.array(shapingEventRowSchema),
  occupation: trimmed,
  temperamentTags: z.array(z.string()),
  temperamentNotes: trimmed,
  valueTags: z.array(z.string()),
  flaws: z.array(personalitySingleLineRowSchema),
  fears: z.array(personalityFearRowSchema),
  habits: z.array(personalitySingleLineRowSchema),
  quirks: z.array(personalitySingleLineRowSchema),
});

export type CharacterFormValues = z.infer<typeof characterFormSchema>;

export const defaultCharacterFormValues: CharacterFormValues = {
  characterName: "",
  playerName: "",
  age: "",
  race: "",
  characterClass: "",
  birthCountry: "",
  birthRegion: "",
  birthCity: "",
  relatives: [],
  shapingEvents: [],
  occupation: "",
  temperamentTags: [],
  temperamentNotes: "",
  valueTags: [],
  flaws: [],
  fears: [],
  habits: [],
  quirks: [],
};

const basicStepSchema = characterFormSchema.pick({
  characterName: true,
  playerName: true,
  age: true,
  race: true,
  characterClass: true,
  occupation: true,
});

const originStepSchema = characterFormSchema.pick({
  birthCountry: true,
  birthRegion: true,
  birthCity: true,
  relatives: true,
  shapingEvents: true,
});

const personalityStepSchema = characterFormSchema.pick({
  temperamentTags: true,
  temperamentNotes: true,
  valueTags: true,
  flaws: true,
  fears: true,
  habits: true,
  quirks: true,
});

/** Zod schema slice validated before leaving each step (extend per milestone). */
export const stepSchemas: Record<FormStepId, z.ZodType<unknown>> = {
  basic: basicStepSchema,
  origin: originStepSchema,
  personality: personalityStepSchema,
  relationships: z.object({}),
  goals: z.object({}),
  appearance: z.object({}),
  freeNotes: z.object({}),
};

/** RHF field names belonging to each step — used with `trigger()` before next. */
export const STEP_FIELD_PATHS: Record<FormStepId, readonly string[]> = {
  basic: [
    "characterName",
    "playerName",
    "age",
    "race",
    "characterClass",
    "occupation",
  ],
  origin: [],
  personality: [],
  relationships: [],
  goals: [],
  appearance: [],
  freeNotes: [],
};

/** Paths to pass to RHF `trigger()` for the step (includes dynamic array fields for `origin`). */
export function getTriggerPathsForStepIndex(
  stepIndex: number,
  values: CharacterFormValues
): string[] {
  const step = FORM_STEPS[stepIndex];
  if (!step) return [];

  if (step.id === "origin") {
    const paths: string[] = ["birthCountry", "birthRegion", "birthCity"];
    const rel = values.relatives ?? [];
    rel.forEach((_, i) => {
      paths.push(
        `relatives.${i}.kinship`,
        `relatives.${i}.name`,
        `relatives.${i}.background`
      );
    });
    const ev = values.shapingEvents ?? [];
    ev.forEach((_, i) => {
      paths.push(
        `shapingEvents.${i}.eventName`,
        `shapingEvents.${i}.myAge`,
        `shapingEvents.${i}.description`
      );
    });
    return paths;
  }

  if (step.id === "personality") {
    const paths: string[] = [
      "temperamentTags",
      "temperamentNotes",
      "valueTags",
    ];
    const flaws = values.flaws ?? [];
    flaws.forEach((_, i) => paths.push(`flaws.${i}.text`));
    const fears = values.fears ?? [];
    fears.forEach((_, i) => {
      paths.push(`fears.${i}.description`, `fears.${i}.level`);
    });
    const habits = values.habits ?? [];
    habits.forEach((_, i) => paths.push(`habits.${i}.text`));
    const quirks = values.quirks ?? [];
    quirks.forEach((_, i) => paths.push(`quirks.${i}.text`));
    return paths;
  }

  return [...STEP_FIELD_PATHS[step.id]];
}

/**
 * Validates the current step slice with Zod (in addition to RHF `trigger`).
 * Keeps per-step rules explicit when schemas diverge from flat field lists.
 */
export function validateStepValues(
  stepId: FormStepId,
  values: CharacterFormValues
): { ok: true } | { ok: false; message: string } {
  const schema = stepSchemas[stepId];

  if (stepId === "origin") {
    const parsed = schema.safeParse({
      birthCountry: values.birthCountry,
      birthRegion: values.birthRegion,
      birthCity: values.birthCity,
      relatives: values.relatives ?? [],
      shapingEvents: values.shapingEvents ?? [],
    });
    if (parsed.success) return { ok: true };
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Verifique os campos desta etapa.",
    };
  }

  if (stepId === "personality") {
    const parsed = schema.safeParse({
      temperamentTags: values.temperamentTags ?? [],
      temperamentNotes: values.temperamentNotes ?? "",
      valueTags: values.valueTags ?? [],
      flaws: values.flaws ?? [],
      fears: values.fears ?? [],
      habits: values.habits ?? [],
      quirks: values.quirks ?? [],
    });
    if (parsed.success) return { ok: true };
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Verifique os campos desta etapa.",
    };
  }

  const paths = STEP_FIELD_PATHS[stepId];
  const slice =
    paths.length === 0
      ? {}
      : Object.fromEntries(
          paths.map((key) => [key, (values as Record<string, unknown>)[key]])
        );
  const parsed = schema.safeParse(slice);
  if (parsed.success) return { ok: true };
  const first = parsed.error.issues[0];
  return {
    ok: false,
    message: first?.message ?? "Verifique os campos desta etapa.",
  };
}
