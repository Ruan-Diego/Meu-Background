import { describe, expect, it } from "vitest";

import type { CharacterDocument } from "@/lib/character-form/document-sections";
import { characterDocumentToPlainText } from "@/lib/character-form/document-plain-text";

describe("characterDocumentToPlainText", () => {
  it("should use Sem nome and underline when character name empty", () => {
    const doc: CharacterDocument = {
      header: { characterName: "", playerName: "", meta: [] },
      sections: [],
      isEmpty: true,
    };
    const text = characterDocumentToPlainText(doc);
    expect(text.startsWith("Sem nome\n")).toBe(true);
    expect(text).toContain("=======");
    expect(text.endsWith("\n")).toBe(true);
  });

  it("should underline title length capped at 72", () => {
    const longName = "x".repeat(100);
    const doc: CharacterDocument = {
      header: { characterName: longName, playerName: "", meta: [] },
      sections: [],
      isEmpty: false,
    };
    const text = characterDocumentToPlainText(doc);
    const firstLine = text.split("\n")[0];
    const secondLine = text.split("\n")[1];
    expect(firstLine?.length).toBe(100);
    expect(secondLine?.length).toBe(72);
  });

  it("should include player line and meta when present", () => {
    const doc: CharacterDocument = {
      header: {
        characterName: "Hero",
        playerName: "Player One",
        meta: [
          { label: "Idade", value: "20" },
          { label: "Raça", value: "Human" },
        ],
      },
      sections: [],
      isEmpty: false,
    };
    const text = characterDocumentToPlainText(doc);
    expect(text).toContain("Por Player One");
    expect(text).toContain("20 · Human");
  });

  it("should render sections with dash underlines", () => {
    const doc: CharacterDocument = {
      header: { characterName: "H", playerName: "", meta: [] },
      sections: [
        {
          id: "s1",
          title: "Origin",
          blocks: [
            { type: "text", label: "Place", value: "City" },
          ],
        },
      ],
      isEmpty: false,
    };
    const text = characterDocumentToPlainText(doc);
    expect(text).toContain("\nOrigin\n");
    expect(text).toMatch(/Origin\n-+\n/);
    expect(text).toContain("Place");
    expect(text).toContain("City");
  });
});
