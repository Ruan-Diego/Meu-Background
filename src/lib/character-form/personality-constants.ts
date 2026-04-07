/** Preset chips for temperament (pt-BR). */
export const TEMPERAMENT_CHIP_OPTIONS = [
  "Irritado",
  "Calmo",
  "Briguento",
  "Alegre",
  "Reservado",
  "Impulsivo",
  "Paciente",
  "Cético",
  "Otimista",
  "Melancólico",
  "Curioso",
  "Orgulhoso",
] as const;

/** Preset chips for values (pt-BR). */
export const VALUES_CHIP_OPTIONS = [
  "Riqueza",
  "Honestidade",
  "Tempo",
  "Aventura",
  "Família",
  "Conhecimento",
  "Poder",
  "Liberdade",
  "Justiça",
  "Amizade",
  "Fé",
  "Lealdade",
] as const;

export const PERSONALITY_FEAR_LEVELS = [
  "leve",
  "medio",
  "alto",
  "fobia",
] as const;

export type PersonalityFearLevel = (typeof PERSONALITY_FEAR_LEVELS)[number];

export const PERSONALITY_FEAR_LEVEL_LABELS: Record<
  PersonalityFearLevel,
  string
> = {
  leve: "Leve",
  medio: "Médio",
  alto: "Alto",
  fobia: "Fobia",
};
