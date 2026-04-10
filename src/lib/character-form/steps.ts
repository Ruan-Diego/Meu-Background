export type FormStepId =
  | "basic"
  | "origin"
  | "personality"
  | "goals"
  | "appearance"
  | "freeNotes"
  | "export";

/** Structural step metadata only; titles and descriptions come from messages (`steps.<id>`). */
export type FormStepMeta = {
  id: FormStepId;
  /** 1-based label for UI */
  indexLabel: number;
};

/**
 * Wizard order. Family / relationship ties are captured in `origin` (M1-F05);
 * there is no separate Relationships step (roadmap M1-F07 removed).
 */
export const FORM_STEPS: readonly FormStepMeta[] = [
  { id: "basic", indexLabel: 1 },
  { id: "origin", indexLabel: 2 },
  { id: "personality", indexLabel: 3 },
  { id: "goals", indexLabel: 4 },
  { id: "appearance", indexLabel: 5 },
  { id: "freeNotes", indexLabel: 6 },
  { id: "export", indexLabel: 7 },
] as const;

export const STEP_COUNT = FORM_STEPS.length;

export function clampStepIndex(index: number): number {
  if (Number.isNaN(index) || index < 0) return 0;
  if (index >= STEP_COUNT) return STEP_COUNT - 1;
  return index;
}
