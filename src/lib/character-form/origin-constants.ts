/** País de nascimento / origem — opções fixas do cenário. */
export const ORIGIN_COUNTRY_OPTIONS = [
  "Braazar do norte",
  "Braazar do sul",
  "Zindrad",
  "Veteris",
  "Yama",
  "Aina Leste",
  "Aina Oeste",
] as const;

export type OriginCountryOption = (typeof ORIGIN_COUNTRY_OPTIONS)[number];

/** Sugestões para região (o jogador pode digitar outro valor). */
export const ORIGIN_REGION_SUGGESTIONS = [
  "Terra Cinza",
  "Península de Veteris",
] as const;
