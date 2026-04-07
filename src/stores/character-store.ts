import { create } from "zustand";

/** Character draft — fields will expand with the Zod schema (M1). */
export type CharacterDraft = Record<string, unknown>;

type CharacterState = {
  draft: CharacterDraft;
  setDraft: (partial: CharacterDraft) => void;
  reset: () => void;
};

const initialDraft: CharacterDraft = {};

export const useCharacterStore = create<CharacterState>((set) => ({
  draft: initialDraft,
  setDraft: (partial) =>
    set((s) => ({ draft: { ...s.draft, ...partial } })),
  reset: () => set({ draft: initialDraft }),
}));
