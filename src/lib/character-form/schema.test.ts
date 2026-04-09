import { describe, expect, it } from "vitest";

import {
  characterFormSchema,
  defaultCharacterFormValues,
  getTriggerPathsForStepIndex,
  mergeInitialFormValues,
  validateStepValues,
  type CharacterFormValues,
} from "@/lib/character-form/schema";
import { FORM_STEPS } from "@/lib/character-form/steps";

const minimalValid: CharacterFormValues = {
  ...defaultCharacterFormValues,
  characterName: "Hero",
};

describe("characterFormSchema", () => {
  it("should accept minimal valid values", () => {
    const parsed = characterFormSchema.safeParse(minimalValid);
    expect(parsed.success).toBe(true);
  });

  it("should reject empty characterName after trim", () => {
    const parsed = characterFormSchema.safeParse({
      ...minimalValid,
      characterName: "   ",
    });
    expect(parsed.success).toBe(false);
  });

  it("should reject missing characterName", () => {
    const bad = { ...minimalValid };
    delete (bad as { characterName?: string }).characterName;
    const parsed = characterFormSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });
});

describe("mergeInitialFormValues", () => {
  it("should return defaults for empty draft", () => {
    expect(mergeInitialFormValues({})).toEqual(defaultCharacterFormValues);
  });

  it("should merge known fields over defaults", () => {
    const merged = mergeInitialFormValues({
      characterName: "Merged",
      playerName: "Player",
    });
    expect(merged.characterName).toBe("Merged");
    expect(merged.playerName).toBe("Player");
    expect(merged.race).toBe("");
  });

  it("should strip legacy goal keys before merge", () => {
    const merged = mergeInitialFormValues({
      characterName: "X",
      longTermAmbitions: "old",
      secrets: "old",
      moralDilemmas: "old",
    } as Parameters<typeof mergeInitialFormValues>[0]);
    expect(
      (merged as Record<string, unknown>).longTermAmbitions
    ).toBeUndefined();
    expect((merged as Record<string, unknown>).secrets).toBeUndefined();
    expect(
      (merged as Record<string, unknown>).moralDilemmas
    ).toBeUndefined();
  });

  it("should coerce malformed shortTermGoals rows", () => {
    const merged = mergeInitialFormValues({
      characterName: "Coerce",
      shortTermGoals: [{ foo: 1 }, null, "x"],
    } as Parameters<typeof mergeInitialFormValues>[0]);
    expect(merged.shortTermGoals).toEqual([
      { meta: "", description: "" },
      { meta: "", description: "" },
      { meta: "", description: "" },
    ]);
  });

  it("should fall back to full defaults when schema parse fails", () => {
    const merged = mergeInitialFormValues({
      characterName: "OK",
      birthCountry: "not-a-valid-country",
    } as Parameters<typeof mergeInitialFormValues>[0]);
    expect(merged).toEqual(defaultCharacterFormValues);
  });
});

describe("validateStepValues", () => {
  it("should allow export step always", () => {
    expect(validateStepValues("export", minimalValid)).toEqual({ ok: true });
  });

  it("should reject basic step without character name", () => {
    const result = validateStepValues("basic", {
      ...minimalValid,
      characterName: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("personagem");
    }
  });

  it("should allow basic step with character name", () => {
    expect(validateStepValues("basic", minimalValid)).toEqual({ ok: true });
  });

  it("should reject origin step with invalid birth country", () => {
    const result = validateStepValues("origin", {
      ...minimalValid,
      birthCountry: "invalid-country",
    });
    expect(result.ok).toBe(false);
  });

  it("should reject personality step with invalid fear level", () => {
    const result = validateStepValues("personality", {
      ...minimalValid,
      fears: [
        {
          description: "Spiders",
          level: "nope",
          background: "",
        },
      ],
    } as CharacterFormValues);
    expect(result.ok).toBe(false);
  });

  it("should allow empty optional steps", () => {
    expect(validateStepValues("origin", minimalValid).ok).toBe(true);
    expect(validateStepValues("personality", minimalValid).ok).toBe(true);
    expect(validateStepValues("goals", minimalValid).ok).toBe(true);
    expect(validateStepValues("appearance", minimalValid).ok).toBe(true);
    expect(validateStepValues("freeNotes", minimalValid).ok).toBe(true);
  });
});

describe("getTriggerPathsForStepIndex", () => {
  it("should return empty array for out-of-range index", () => {
    expect(getTriggerPathsForStepIndex(-1, minimalValid)).toEqual([]);
    expect(getTriggerPathsForStepIndex(FORM_STEPS.length, minimalValid)).toEqual(
      []
    );
  });

  it("should return static paths for basic step", () => {
    expect(getTriggerPathsForStepIndex(0, minimalValid)).toEqual([
      "characterName",
      "playerName",
      "age",
      "race",
      "characterClass",
      "occupation",
    ]);
  });

  it("should expand origin paths for relatives and shaping events", () => {
    const values: CharacterFormValues = {
      ...minimalValid,
      relatives: [{ kinship: "a", name: "b", background: "c" }],
      shapingEvents: [
        { eventName: "e", myAge: "10", description: "d" },
      ],
    };
    const paths = getTriggerPathsForStepIndex(1, values);
    expect(paths).toContain("birthCountry");
    expect(paths).toContain("relatives.0.kinship");
    expect(paths).toContain("shapingEvents.0.eventName");
  });

  it("should expand personality paths for dynamic rows", () => {
    const values: CharacterFormValues = {
      ...minimalValid,
      flaws: [{ text: "f", background: "g" }],
      fears: [
        { description: "x", level: "leve", background: "" },
      ],
    };
    const paths = getTriggerPathsForStepIndex(2, values);
    expect(paths).toContain("temperamentTags");
    expect(paths).toContain("flaws.0.text");
    expect(paths).toContain("fears.0.level");
  });
});
