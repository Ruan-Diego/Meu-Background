export type FormStepId =
  | "basic"
  | "origin"
  | "personality"
  | "relationships"
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

/** Order matches roadmap M1-F04–F10. */
export const FORM_STEPS: readonly FormStepMeta[] = [
  {
    id: "basic",
    indexLabel: 1,
    title: "Informações básicas",
    description:
      "Nome do personagem e do jogador, sistema, campanha e nível ou patamar.",
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
    description: "Temperamento, valores, medos, hábitos e peculiaridades.",
  },
  {
    id: "relationships",
    indexLabel: 4,
    title: "Relacionamentos",
    description: "Aliados, rivais, mentores e laços familiares.",
  },
  {
    id: "goals",
    indexLabel: 5,
    title: "Objetivos e motivações",
    description: "Metas, ambições, segredos e dilemas morais.",
  },
  {
    id: "appearance",
    indexLabel: 6,
    title: "Aparência",
    description: "Descrição física, marcas distintivas e estilo.",
  },
  {
    id: "freeNotes",
    indexLabel: 7,
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
