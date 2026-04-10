import { describe, expect, it } from "vitest";

import { getOptionLabel } from "@/lib/i18n/option-labels";

describe("getOptionLabel", () => {
  it("should return the localized string when the key exists", () => {
    const messages = {
      options: {
        originCountry: {
          "Aina Leste": "East Aina",
        },
      },
    };
    expect(
      getOptionLabel(messages, "originCountry", "Aina Leste"),
    ).toBe("East Aina");
  });

  it("should fall back to the key when missing or malformed tree", () => {
    expect(getOptionLabel({}, "originCountry", "X")).toBe("X");
    expect(
      getOptionLabel({ options: {} }, "originCountry", "X"),
    ).toBe("X");
    expect(
      getOptionLabel(
        { options: { originCountry: { X: 1 } } },
        "originCountry",
        "X",
      ),
    ).toBe("X");
  });
});
