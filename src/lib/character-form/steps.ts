export type FormStepId =
  | "basic"
  | "origin"
  | "personality"
  | "goals"
  | "appearance"
  | "freeNotes";

export type FormStepMeta = {
  id: FormStepId;
  /** 1-based label for UI */
  indexLabel: number;
  title: string;
  description: string;
};

/**
 * Wizard order. Family / relationship ties are captured in `origin` (M1-F05);
 * there is no separate Relationships step (roadmap M1-F07 removed).
 */
export const FORM_STEPS: readonly FormStepMeta[] = [
  {
    id: "basic",
    indexLabel: 1,
    title: "Informações básicas",
    description:
      "Nome do personagem e do jogador, idade, raça e classe — foco no retrato do personagem.",
  },
  {
    id: "origin",
    indexLabel: 2,
    title: "Origem e histórico",
    description: "Lugar de origem, família, classe social e eventos marcantes.",
  },
  {
    id: "personality",
    indexLabel: 3,
    title: "Personalidade e traços",
    description:
      "Temperamento, valores, fraquezas, medos, hábitos e peculiaridades.",
  },
  {
    id: "goals",
    indexLabel: 4,
    title: "Objetivos e motivações",
    description: "Metas de curto prazo e objetivos de vida, em blocos de descrição.",
  },
  {
    id: "appearance",
    indexLabel: 5,
    title: "Aparência além da miniatura",
    description:
      "O que a referência visual não conta: altura, marcas escondidas, impressão, voz e hábitos corporais.",
  },
  {
    id: "freeNotes",
    indexLabel: 6,
    title: "Notas livres",
    description: "Qualquer detalhe que não couber nas etapas anteriores.",
  },
] as const;

export const STEP_COUNT = FORM_STEPS.length;

export function clampStepIndex(index: number): number {
  if (Number.isNaN(index) || index < 0) return 0;
  if (index >= STEP_COUNT) return STEP_COUNT - 1;
  return index;
}
