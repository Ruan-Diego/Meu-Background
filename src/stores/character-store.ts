import { create } from "zustand";

import { clampStepIndex } from "@/lib/character-form/steps";

/** Character draft — fields will expand with the Zod schema (M1). */
export type CharacterDraft = Record<string, unknown>;

type CharacterState = {
  draft: CharacterDraft;
  currentStepIndex: number;
  setDraft: (partial: CharacterDraft) => void;
  setCurrentStepIndex: (index: number) => void;
  reset: () => void;
};

const initialDraft: CharacterDraft = {};

export const useCharacterStore = create<CharacterState>((set) => ({
  draft: initialDraft,
  currentStepIndex: 0,
  setDraft: (partial) =>
    set((s) => ({ draft: { ...s.draft, ...partial } })),
  setCurrentStepIndex: (index) =>
    set({ currentStepIndex: clampStepIndex(index) }),
  reset: () => set({ draft: initialDraft, currentStepIndex: 0 }),
}));
