import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

import {
  defaultCharacterFormValues,
  mergeInitialFormValues,
  type CharacterFormValues,
} from "@/lib/character-form/schema";
import { clampStepIndex } from "@/lib/character-form/steps";

/** Namespace for M4-F01+; keep adjacent keys under `meu-background.*`. */
export const CHARACTER_DRAFT_STORAGE_KEY =
  "meu-background.character-draft-v1" as const;

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

type PersistedCharacterSlice = Pick<
  CharacterState,
  "draft" | "currentStepIndex"
>;

const initialDraft: CharacterDraft = { ...defaultCharacterFormValues };

function mergePersistedCharacterState(
  persistedState: unknown,
  currentState: CharacterState
): CharacterState {
  if (persistedState == null || typeof persistedState !== "object") {
    return currentState;
  }
  const p = persistedState as {
    draft?: unknown;
    currentStepIndex?: unknown;
  };
  const mergedDraft = mergeInitialFormValues(
    (p.draft != null && typeof p.draft === "object"
      ? (p.draft as Record<string, unknown>)
      : {}) as CharacterDraft
  );
  const step =
    typeof p.currentStepIndex === "number" &&
    Number.isFinite(p.currentStepIndex)
      ? clampStepIndex(p.currentStepIndex)
      : currentState.currentStepIndex;
  return {
    ...currentState,
    draft: mergedDraft,
    currentStepIndex: step,
  };
}

let persistWriteFailedLogged = false;

function createSafeCharacterPersistStorage(): PersistStorage<PersistedCharacterSlice> {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      try {
        const str = window.localStorage.getItem(name);
        if (str == null) return null;
        return JSON.parse(str) as {
          state: PersistedCharacterSlice;
          version?: number;
        };
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(name, JSON.stringify(value));
      } catch {
        if (!persistWriteFailedLogged && process.env.NODE_ENV !== "production") {
          persistWriteFailedLogged = true;
          console.warn(
            "[character-store] localStorage.setItem failed; draft is kept in memory only for this session."
          );
        }
      }
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
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
      reset: () => {
        useCharacterStore.persist.clearStorage();
        set({
          draft: { ...defaultCharacterFormValues },
          currentStepIndex: 0,
        });
      },
    }),
    {
      name: CHARACTER_DRAFT_STORAGE_KEY,
      storage: createSafeCharacterPersistStorage(),
      partialize: (state): PersistedCharacterSlice => ({
        draft: state.draft,
        currentStepIndex: state.currentStepIndex,
      }),
      merge: mergePersistedCharacterState,
    }
  )
);
