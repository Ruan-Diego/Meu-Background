import { z } from "zod";

import { FORM_STEPS, type FormStepId } from "@/lib/character-form/steps";

/**
 * Single source of truth for the character form. M1-F04+ will add fields
 * here and register each key under the matching step in `STEP_FIELD_PATHS`.
 */
export const characterFormSchema = z.object({
  // Placeholder — real fields land in M1-F04 onward.
});

export type CharacterFormValues = z.infer<typeof characterFormSchema>;

/** Zod schema slice validated before leaving each step (extend per milestone). */
export const stepSchemas: Record<FormStepId, z.ZodType<unknown>> = {
  basic: z.object({}),
  origin: z.object({}),
  personality: z.object({}),
  relationships: z.object({}),
  goals: z.object({}),
  appearance: z.object({}),
  freeNotes: z.object({}),
};

/** RHF field names belonging to each step — used with `trigger()` before next. */
export const STEP_FIELD_PATHS: Record<FormStepId, readonly string[]> =
  FORM_STEPS.reduce(
    (acc, step) => {
      acc[step.id] = [];
      return acc;
    },
    {} as Record<FormStepId, readonly string[]>
  );

export function getFieldsForStepIndex(stepIndex: number): string[] {
  const step = FORM_STEPS[stepIndex];
  if (!step) return [];
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
