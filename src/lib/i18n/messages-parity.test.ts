import { describe, expect, it } from "vitest";

import en from "../../../messages/en.json";
import ptBR from "../../../messages/pt-BR.json";

/**
 * Recursively assert identical key sets (sorted) at every object level.
 * Arrays must have the same length; elements are compared by index.
 */
function assertKeyParity(a: unknown, b: unknown, path: string): void {
  const label = path || "root";

  if (a === null || b === null) {
    expect(b, label).toBe(a);
    return;
  }

  expect(typeof b, `${label}: type`).toBe(typeof a);

  if (typeof a !== "object") {
    return;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    expect(Array.isArray(a), `${label}: left is array`).toBe(true);
    expect(Array.isArray(b), `${label}: right is array`).toBe(true);
    expect((b as unknown[]).length, `${label}: length`).toBe(
      (a as unknown[]).length,
    );
    (a as unknown[]).forEach((av, i) => {
      assertKeyParity(av, (b as unknown[])[i], `${path}[${i}]`);
    });
    return;
  }

  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  const aKeys = Object.keys(ao).sort();
  const bKeys = Object.keys(bo).sort();
  expect(bKeys, label).toEqual(aKeys);

  for (const k of aKeys) {
    assertKeyParity(ao[k], bo[k], path ? `${path}.${k}` : k);
  }
}

describe("i18n message files", () => {
  it("should have the same key structure in pt-BR and en", () => {
    assertKeyParity(ptBR, en, "");
  });
});
