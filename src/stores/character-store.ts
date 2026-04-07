import { create } from "zustand";

import {
  defaultCharacterFormValues,
  mergeInitialFormValues,
  type CharacterFormValues,
} from "@/lib/character-form/schema";
import { clampStepIndex } from "@/lib/character-form/steps";

/** Character draft — aligned with `CharacterFormValues` as fields are added (M1). */
export type CharacterDraft = Partial<CharacterFormValues> &
  Record<string, unknown>;

type CharacterState = {
  draft: CharacterDraft;
  currentStepIndex: number;
  setDraft: (partial: CharacterDraft) => void;
  setCurrentStepIndex: (index: number) => void;
  reset: () => void;
};

const initialDraft: CharacterDraft = { ...defaultCharacterFormValues };

export const useCharacterStore = create<CharacterState>((set) => ({
  draft: initialDraft,
  currentStepIndex: 0,
  setDraft: (partial) =>
    set((s) => ({
      draft: mergeInitialFormValues({
        ...s.draft,
        ...partial,
      } as CharacterDraft),
    })),
  setCurrentStepIndex: (index) =>
    set({ currentStepIndex: clampStepIndex(index) }),
  reset: () =>
    set({ draft: { ...defaultCharacterFormValues }, currentStepIndex: 0 }),
}));
