/**
 * Replace `{name}`-style placeholders in a string.
 */
export function formatMessage(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key];
    return v !== undefined ? String(v) : `{${key}}`;
  });
}

export function getMessageValue(
  messages: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = messages;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}
