export type OptionsCategory =
  | "originCountry"
  | "temperamentChips"
  | "valueChips";

/**
 * Resolve a localized option label from `messages.options.<category>[key]`.
 * Keys may contain spaces (e.g. country names); dot-path lookup cannot represent them.
 */
export function getOptionLabel(
  messages: Record<string, unknown>,
  category: OptionsCategory,
  key: string
): string {
  const optionsRoot = messages.options;
  if (!optionsRoot || typeof optionsRoot !== "object") return key;
  const bucket = (optionsRoot as Record<string, unknown>)[category];
  if (!bucket || typeof bucket !== "object") return key;
  const label = (bucket as Record<string, unknown>)[key];
  return typeof label === "string" ? label : key;
}
