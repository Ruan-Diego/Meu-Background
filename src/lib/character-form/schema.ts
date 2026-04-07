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
  background: trimmed,
});

const personalityFearRowSchema = z.object({
  description: trimmed,
  level: z.enum(PERSONALITY_FEAR_LEVELS),
  background: trimmed,
});

/** Metas: linha “Meta” + descrição opcional (revelada no UI). */
const shortTermGoalRowSchema = z.object({
  meta: trimmed,
  description: trimmed,
});

/** Objetivo de vida: linha “Objetivo” + descrição opcional. */
const lifeGoalRowSchema = z.object({
  objective: trimmed,
  description: trimmed,
});

/** Notas livres: rótulo curto + corpo (M1-F09). */
const freeNoteRowSchema = z.object({
  topic: trimmed,
  description: trimmed,
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
  valueTags: z.array(z.string()),
  flaws: z.array(personalitySingleLineRowSchema),
  fears: z.array(personalityFearRowSchema),
  habits: z.array(personalitySingleLineRowSchema),
  quirks: z.array(personalitySingleLineRowSchema),
  shortTermGoals: z.array(shortTermGoalRowSchema),
  lifeGoals: z.array(lifeGoalRowSchema),
  /** Detalhes que a miniatura / Hero Forge não mostram (M1-F08). */
  heightDescription: trimmed,
  hiddenMarksAndScars: trimmed,
  firstImpression: trimmed,
  voiceAndSpeech: trimmed,
  movementAndMannerisms: trimmed,
  freeNotes: z.array(freeNoteRowSchema),
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
  valueTags: [],
  flaws: [],
  fears: [],
  habits: [],
  quirks: [],
  shortTermGoals: [],
  lifeGoals: [],
  heightDescription: "",
  hiddenMarksAndScars: "",
  firstImpression: "",
  voiceAndSpeech: "",
  movementAndMannerisms: "",
  freeNotes: [],
};

const LEGACY_GOALS_KEYS = [
  "longTermAmbitions",
  "secrets",
  "moralDilemmas",
] as const;

function coerceShortTermGoalRows(
  raw: unknown
): CharacterFormValues["shortTermGoals"] {
  if (!Array.isArray(raw)) return defaultCharacterFormValues.shortTermGoals;
  return raw.map((row) => {
    if (row && typeof row === "object") {
      const r = row as Record<string, unknown>;
      const description =
        typeof r.description === "string" ? r.description : "";
      const meta = typeof r.meta === "string" ? r.meta : "";
      return { meta, description };
    }
    return { meta: "", description: "" };
  });
}

function coerceLifeGoalRows(raw: unknown): CharacterFormValues["lifeGoals"] {
  if (!Array.isArray(raw)) return defaultCharacterFormValues.lifeGoals;
  return raw.map((row) => {
    if (row && typeof row === "object") {
      const r = row as Record<string, unknown>;
      const description =
        typeof r.description === "string" ? r.description : "";
      const objective =
        typeof r.objective === "string" ? r.objective : "";
      return { objective, description };
    }
    return { objective: "", description: "" };
  });
}

function coerceFreeNoteRows(raw: unknown): CharacterFormValues["freeNotes"] {
  if (!Array.isArray(raw)) return defaultCharacterFormValues.freeNotes;
  return raw.map((row) => {
    if (row && typeof row === "object") {
      const r = row as Record<string, unknown>;
      return {
        topic: typeof r.topic === "string" ? r.topic : "",
        description:
          typeof r.description === "string" ? r.description : "",
      };
    }
    return { topic: "", description: "" };
  });
}

/**
 * Merge persisted draft into defaults; drops removed fields and coerces
 * pre–M1-F07 string shapes to empty arrays. Output matches `characterFormSchema`.
 */
export function mergeInitialFormValues(
  draft: Partial<CharacterFormValues> & Record<string, unknown>
): CharacterFormValues {
  const d = { ...draft } as Record<string, unknown>;
  for (const k of LEGACY_GOALS_KEYS) {
    delete d[k];
  }
  const shortTermGoals = coerceShortTermGoalRows(d.shortTermGoals);
  const lifeGoals = coerceLifeGoalRows(d.lifeGoals);
  const freeNotes = coerceFreeNoteRows(d.freeNotes);
  const merged = {
    ...defaultCharacterFormValues,
    ...d,
    shortTermGoals,
    lifeGoals,
    freeNotes,
  };
  const parsed = characterFormSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaultCharacterFormValues;
}

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
  valueTags: true,
  flaws: true,
  fears: true,
  habits: true,
  quirks: true,
});

const goalsStepSchema = characterFormSchema.pick({
  shortTermGoals: true,
  lifeGoals: true,
});

const appearanceStepSchema = characterFormSchema.pick({
  heightDescription: true,
  hiddenMarksAndScars: true,
  firstImpression: true,
  voiceAndSpeech: true,
  movementAndMannerisms: true,
});

const freeNotesStepSchema = characterFormSchema.pick({
  freeNotes: true,
});

const reviewStepSchema = z.object({});

/** Zod schema slice validated before leaving each step (extend per milestone). */
export const stepSchemas: Record<FormStepId, z.ZodType<unknown>> = {
  basic: basicStepSchema,
  origin: originStepSchema,
  personality: personalityStepSchema,
  goals: goalsStepSchema,
  appearance: appearanceStepSchema,
  freeNotes: freeNotesStepSchema,
  review: reviewStepSchema,
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
  goals: [],
  appearance: [
    "heightDescription",
    "hiddenMarksAndScars",
    "firstImpression",
    "voiceAndSpeech",
    "movementAndMannerisms",
  ],
  freeNotes: [],
  review: [],
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
    const paths: string[] = ["temperamentTags", "valueTags"];
    const flaws = values.flaws ?? [];
    flaws.forEach((_, i) => {
      paths.push(`flaws.${i}.text`, `flaws.${i}.background`);
    });
    const fears = values.fears ?? [];
    fears.forEach((_, i) => {
      paths.push(
        `fears.${i}.description`,
        `fears.${i}.level`,
        `fears.${i}.background`
      );
    });
    const habits = values.habits ?? [];
    habits.forEach((_, i) => {
      paths.push(`habits.${i}.text`, `habits.${i}.background`);
    });
    const quirks = values.quirks ?? [];
    quirks.forEach((_, i) => {
      paths.push(`quirks.${i}.text`, `quirks.${i}.background`);
    });
    return paths;
  }

  if (step.id === "goals") {
    const paths: string[] = [];
    const metas = values.shortTermGoals ?? [];
    metas.forEach((_, i) => {
      paths.push(
        `shortTermGoals.${i}.meta`,
        `shortTermGoals.${i}.description`
      );
    });
    const life = values.lifeGoals ?? [];
    life.forEach((_, i) => {
      paths.push(
        `lifeGoals.${i}.objective`,
        `lifeGoals.${i}.description`
      );
    });
    return paths;
  }

  if (step.id === "freeNotes") {
    const paths: string[] = [];
    const notes = values.freeNotes ?? [];
    notes.forEach((_, i) => {
      paths.push(`freeNotes.${i}.topic`, `freeNotes.${i}.description`);
    });
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
  if (stepId === "review") return { ok: true };

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

  if (stepId === "goals") {
    const parsed = schema.safeParse({
      shortTermGoals: values.shortTermGoals ?? [],
      lifeGoals: values.lifeGoals ?? [],
    });
    if (parsed.success) return { ok: true };
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Verifique os campos desta etapa.",
    };
  }

  if (stepId === "appearance") {
    const parsed = schema.safeParse({
      heightDescription: values.heightDescription ?? "",
      hiddenMarksAndScars: values.hiddenMarksAndScars ?? "",
      firstImpression: values.firstImpression ?? "",
      voiceAndSpeech: values.voiceAndSpeech ?? "",
      movementAndMannerisms: values.movementAndMannerisms ?? "",
    });
    if (parsed.success) return { ok: true };
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Verifique os campos desta etapa.",
    };
  }

  if (stepId === "freeNotes") {
    const parsed = schema.safeParse({
      freeNotes: values.freeNotes ?? [],
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
