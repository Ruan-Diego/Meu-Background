import { describe, expect, it } from "vitest";

import { buildCharacterDocument } from "@/lib/character-form/document-sections";
import {
  defaultCharacterFormValues,
  type CharacterFormValues,
} from "@/lib/character-form/schema";

describe("buildCharacterDocument", () => {
  it("should mark document empty when only defaults", () => {
    const doc = buildCharacterDocument(defaultCharacterFormValues);
    expect(doc.isEmpty).toBe(true);
    expect(doc.sections).toHaveLength(0);
    expect(doc.header.characterName).toBe("");
  });

  it("should populate header when basic fields are filled", () => {
    const values: CharacterFormValues = {
      ...defaultCharacterFormValues,
      characterName: "Aria",
      playerName: "Alex",
      age: "30",
      race: "Elf",
      characterClass: "Ranger",
      occupation: "Scout",
    };
    const doc = buildCharacterDocument(values);
    expect(doc.isEmpty).toBe(false);
    expect(doc.header.characterName).toBe("Aria");
    expect(doc.header.playerName).toBe("Alex");
    expect(doc.header.meta.map((m) => m.value)).toEqual([
      "30",
      "Elf",
      "Ranger",
      "Scout",
    ]);
  });

  it("should include origin section when place or relatives exist", () => {
    const values: CharacterFormValues = {
      ...defaultCharacterFormValues,
      characterName: "B",
      birthCountry: "Yama",
      birthRegion: "North",
      relatives: [
        { kinship: "Mother", name: "Mae", background: "Farmer" },
      ],
    };
    const doc = buildCharacterDocument(values);
    const origin = doc.sections.find((s) => s.id === "origin");
    expect(origin).toBeDefined();
    expect(origin?.title).toBe("Origem e Histórico");
    expect(origin?.blocks.some((b) => b.type === "text")).toBe(true);
    expect(origin?.blocks.some((b) => b.type === "entries")).toBe(true);
  });

  it("should include personality section when tags or rows exist", () => {
    const values: CharacterFormValues = {
      ...defaultCharacterFormValues,
      characterName: "C",
      temperamentTags: ["Calmo"],
      flaws: [{ text: "Impaciente", background: "Em combate" }],
    };
    const doc = buildCharacterDocument(values);
    const section = doc.sections.find((s) => s.id === "personality");
    expect(section).toBeDefined();
    expect(section?.blocks.some((b) => b.type === "tags")).toBe(true);
    expect(section?.blocks.some((b) => b.type === "entries")).toBe(true);
  });

  it("should include all sections when fully populated", () => {
    const values: CharacterFormValues = {
      ...defaultCharacterFormValues,
      characterName: "Full",
      birthCity: "X",
      heightDescription: "Tall",
      shortTermGoals: [{ meta: "Find map", description: "" }],
      freeNotes: [{ topic: "Extra", description: "Note body" }],
    };
    const doc = buildCharacterDocument(values);
    const ids = doc.sections.map((s) => s.id);
    expect(ids).toContain("origin");
    expect(ids).toContain("goals");
    expect(ids).toContain("appearance");
    expect(ids).toContain("freeNotes");
  });
});
