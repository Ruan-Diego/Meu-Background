import { describe, expect, it } from "vitest";

import { withLocalePath } from "@/lib/i18n/paths";

describe("withLocalePath", () => {
  it("should map home to /{locale}", () => {
    expect(withLocalePath("pt-BR", "/")).toBe("/pt-BR");
    expect(withLocalePath("en", "")).toBe("/en");
  });

  it("should prefix nested paths", () => {
    expect(withLocalePath("pt-BR", "/criar")).toBe("/pt-BR/criar");
    expect(withLocalePath("en", "criar")).toBe("/en/criar");
  });
});
