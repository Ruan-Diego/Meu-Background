# M1-F14 — Auto-save (localStorage)

## Problem Statement

Draft character data and the current wizard step live only in memory (`Zustand`). If the user refreshes the tab, closes it by accident, or the browser crashes, they lose everything they typed. Milestone 1’s definition of done explicitly requires **data surviving a page refresh**. Persisting the character store to `localStorage` and rehydrating on load closes that gap without accounts or a backend.

## Goals

- [ ] Persist the full character draft (`CharacterDraft` / `CharacterFormValues` shape) to `localStorage` whenever it changes meaningfully
- [ ] Persist `currentStepIndex` so the user returns to the same step after reload
- [ ] On return visit (same browser / origin), restore draft and step so the wizard shows the same data the user left off with
- [ ] Keep behavior aligned with **M4-F01** later: a single well-known storage key namespace so multi-character storage can extend without rewriting clients

## Out of Scope

| Feature | Reason |
| --- | --- |
| Multiple named characters / library UI | **M4-F01** |
| Import/export JSON file | **M4-F02** |
| Server sync, accounts, encryption | Product is client-first; no backend in M1 |
| Cross-device continuity | Would require cloud or manual export |
| “Last write wins” across tabs (advanced sync) | Acceptable for MVP: concurrent edits in two tabs are rare; last persisted state wins |
| Opt-in toggle to disable auto-save | Nice-to-have; not required for M1 DoD |

---

## User Stories

### P1: Persist draft and step ⭐ MVP

**User Story**: As a player filling the wizard, I want my answers and current step saved automatically so that I do not lose work if I refresh or come back later.

**Why P1**: Required for M1 “Definition of Done” and core trust in the app.

**Acceptance Criteria**:

1. WHEN the user changes any field that updates the character draft in global state THEN the system SHALL persist the latest draft to `localStorage` (no requirement for the user to click “Save”)
2. WHEN the user moves to another step (next, previous, step rail, or keyboard shortcut) THEN the system SHALL persist both the merged draft and `currentStepIndex`
3. WHEN the user reloads the page or opens `/criar` again in the same browser THEN the system SHALL load persisted draft and step before or as the wizard becomes interactive
4. WHEN persisted data exists THEN React Hook Form–controlled fields SHALL display the restored values (no silent reset to empty defaults after load)

**Independent Test**: Enter a distinctive value on Step 1, advance to Step 3, hard-refresh the page; confirm the value and active step (3) match after load.

---

### P1: Safe defaults and schema drift ⭐ MVP

**User Story**: As a player after an app update, I want old saved data to load without breaking the form so that I am not stuck on a blank or error state.

**Why P1**: Deploys will change `CharacterFormValues`; storage must stay tolerant.

**Acceptance Criteria**:

1. WHEN persisted JSON is missing keys or has unknown keys THEN the system SHALL merge with `defaultCharacterFormValues` / `mergeInitialFormValues` (same tolerance strategy as in-memory draft)
2. WHEN persisted JSON is invalid or not an object THEN the system SHALL fall back to fresh defaults and SHALL not throw during app bootstrap
3. WHEN the stored `currentStepIndex` is out of range for the current `STEP_COUNT` THEN the system SHALL clamp it with the same rules as `clampStepIndex`

**Independent Test**: Manually corrupt `localStorage` entry (invalid JSON, `{}`, huge step index); reload; wizard should mount with defaults and a valid step.

---

### P1: Reset clears persisted data ⭐ MVP

**User Story**: As a player who starts over, I want “reset” to wipe saved progress so that I do not see old data come back after a refresh.

**Why P1**: Without this, reset would only clear memory until the next reload.

**Acceptance Criteria**:

1. WHEN the user invokes the existing store `reset()` (or equivalent “new character” path exposed by the product) THEN the system SHALL remove or overwrite the persisted snapshot so a subsequent reload shows empty defaults and step 0
2. WHEN no prior save exists THEN reset SHALL behave as today (idempotent)

**Independent Test**: Fill data, reset, refresh; form and step should be empty/first step.

---

### P2: Graceful degradation when storage is unavailable

**User Story**: As a player in a restricted environment (private mode, quota exceeded, disabled storage), I still want to use the wizard in-session even if data cannot be kept across reloads.

**Why P2**: Fail closed on persistence, not on using the app.

**Acceptance Criteria**:

1. WHEN `localStorage` read/write throws or is unavailable THEN the wizard SHALL remain usable for the current session
2. WHEN persistence fails THEN the system SHALL avoid infinite retry loops or console error storms (fail quietly or log once)

**Independent Test**: Simulate `localStorage.setItem` throwing; confirm typing and step navigation still work until reload.

---

## Edge Cases

- WHEN the user clears site data in the browser THEN the next visit SHALL behave like a first visit (defaults)
- WHEN storage quota is exceeded THEN persistence MAY fail; session behavior still works (see P2)
- WHEN two tabs are open THEN both MAY write the same key; last write wins — no merge conflict UI in M1
- WHEN the user navigates away without changing step THEN any in-flight field edits already reflected in the store SHALL already be persisted (implementation may debounce writes, but SHALL not drop the latest values before unload in the common case — prefer flush on `visibilitychange`/`pagehide` if debouncing)

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| SAVE-01 | P1: Persist draft and step | Execute | Pending |
| SAVE-02 | P1: Safe defaults and schema drift | Execute | Pending |
| SAVE-03 | P1: Reset clears persisted data | Execute | Pending |
| SAVE-04 | P2: Graceful degradation | Execute | Pending |

**Coverage:** 4 total, 0 mapped to tasks, 4 unmapped ⚠️

---

## Success Criteria

- [ ] Hard refresh mid-wizard restores both field values and current step
- [ ] New deploy / partial JSON does not white-screen or trap the user; merges and clamps apply
- [ ] Reset (or documented equivalent) clears persistence so a fresh character stays fresh after reload
- [ ] M1 Definition of Done line is satisfied: *“with data surviving a page refresh”*

---

## Notes (implementation hints, non-normative)

- **Likely touchpoints:** `src/stores/character-store.ts` (e.g. Zustand `persist` middleware with `partialize` for `draft` + `currentStepIndex` only), and the wizard’s sync between store and `react-hook-form` on rehydration (e.g. `reset` with merged values when persisted state appears).
- **Storage key:** Use a single stable key (e.g. namespaced `meu-background` + `character-draft-v1`) documented in code so **M4-F01** can add adjacent keys without collision.
- **SSR:** Next.js App Router runs client components on server first; persistence logic must run only in the browser (middleware `createJSONStorage(() => localStorage)` or dynamic import pattern as per Zustand docs).
