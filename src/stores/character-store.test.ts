import { beforeEach, describe, expect, it } from "vitest";

import { defaultCharacterFormValues } from "@/lib/character-form/schema";
import { STEP_COUNT } from "@/lib/character-form/steps";
import {
  CHARACTER_DRAFT_STORAGE_KEY,
  useCharacterStore,
} from "@/stores/character-store";

describe("useCharacterStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useCharacterStore.persist.clearStorage();
    useCharacterStore.setState({
      draft: { ...defaultCharacterFormValues },
      currentStepIndex: 0,
    });
  });

  it("should merge partial draft via setDraft", () => {
    useCharacterStore.getState().setDraft({ characterName: "Store Hero" });
    expect(useCharacterStore.getState().draft.characterName).toBe("Store Hero");
  });

  it("should keep other draft fields when characterName is cleared", () => {
    useCharacterStore.getState().setDraft({
      characterName: "A",
      playerName: "Player",
    });
    useCharacterStore.getState().setDraft({ characterName: "" });
    expect(useCharacterStore.getState().draft.characterName).toBe("");
    expect(useCharacterStore.getState().draft.playerName).toBe("Player");
  });

  it("should clamp setCurrentStepIndex to valid range", () => {
    useCharacterStore.getState().setCurrentStepIndex(STEP_COUNT);
    expect(useCharacterStore.getState().currentStepIndex).toBe(STEP_COUNT - 1);
    useCharacterStore.getState().setCurrentStepIndex(-5);
    expect(useCharacterStore.getState().currentStepIndex).toBe(0);
  });

  it("should reset draft and step and persist default snapshot", () => {
    useCharacterStore.getState().setDraft({ characterName: "Temp" });
    useCharacterStore.getState().setCurrentStepIndex(3);
    useCharacterStore.getState().reset();
    expect(useCharacterStore.getState().draft.characterName).toBe("");
    expect(useCharacterStore.getState().currentStepIndex).toBe(0);
    const raw = localStorage.getItem(CHARACTER_DRAFT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as {
      state: { draft: { characterName: string }; currentStepIndex: number };
    };
    expect(parsed.state.draft.characterName).toBe("");
    expect(parsed.state.currentStepIndex).toBe(0);
  });
});
