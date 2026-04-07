# M1-F05 — Step: Origin & Background

## Goal

Implement the second wizard step (`origin` / “Origem e histórico”) so players can record where the character comes from, family context, social standing, life-shaping events, and occupation — using the same form stack as M1-F04 (React Hook Form, Zod, Zustand draft, per-step validation hooks).

## Problem

After basic identity, the backstory needs a structured place for **origem e histórico**. Today the step exists in navigation and copy but has **no fields** and an empty Zod slice; data cannot be captured or persisted for preview/export later.

## Requirements

- `ORIG-001` The `origin` step SHALL render a dedicated field group (layout and a11y patterns consistent with `BasicInfoFields`: labels, inputs, `aria-invalid` / `aria-describedby`, error text).
- `ORIG-002` The form model SHALL include these **pt-BR-labeled** concepts (implementation keys in parentheses; adjust only if a naming convention doc overrides):
  - **Lugar de nascimento / origem** (`birthplace`) — short text.
  - **Família** (`familyBackground`) — short or medium text (composição, laços, legado).
  - **Classe social** (`socialClass`) — short text (posição econômica / status na sociedade do cenário).
  - **Eventos formativos** (`formativeEvents`) — multi-line text (momentos que moldaram o personagem).
  - **Ocupação / profissão** (`occupation`) — short text.
- `ORIG-003` All origin fields SHALL be **optional** in Zod for this milestone (empty strings allowed; trim whitespace). Advancing past this step MUST NOT be blocked by unfilled origin fields.
- `ORIG-004` `characterFormSchema`, `defaultCharacterFormValues`, `stepSchemas.origin`, and `STEP_FIELD_PATHS.origin` SHALL list the new keys so `trigger`, `validateStepValues`, and draft persistence behave like the basic step.
- `ORIG-005` `CharacterFormWizard` SHALL render the new component when the active step is `origin` (same pattern as `basic` → `BasicInfoFields`).

## Out of scope

| Item | Reason |
|------|--------|
| Rich placeholders, hints, “como preencher”, examples | Milestone 3 (M3-F01–F04) |
| Dynamic repeating groups (e.g. multiple events as list items) | Keep single text areas/inputs for MVP; lists are M1-F07-style patterns |
| Campaign-specific terminology locks (e.g. only D&D backgrounds) | M4 templates |
| Export / preview body content | M1-F11+ consume the same schema keys |

## Acceptance criteria (WHEN / THEN)

1. WHEN the user is on step 2 (Origem e histórico) THEN the UI SHALL show all five fields with Portuguese labels matching the concepts above.
2. WHEN the user types in those fields and moves to another step or refreshes (after auto-save exists, M1-F15) THEN values SHALL round-trip via the existing draft mechanism (same keys in the store).
3. WHEN the user leaves every origin field empty THEN the wizard SHALL still allow **Próximo** without Zod blocking (only global/step errors from other rules may apply).
4. WHEN the user enters only whitespace in a field THEN persisted values SHALL normalize to empty via the shared `trim()` pattern used in `schema.ts`.

## Verification

- Manual: open `/criar`, go to step 2, fill and clear fields, navigate next/previous; confirm no console errors and RHF/Zustand state contains the new keys when filled.
- Automated (when tests exist for the wizard): extend fixtures/types so `CharacterFormValues` includes the new fields and any step schema test covers `origin` as pass-through for empty input.

## Requirement traceability

| ID | Status |
|----|--------|
| ORIG-001 | Done |
| ORIG-002 | Done |
| ORIG-003 | Done |
| ORIG-004 | Done |
| ORIG-005 | Done |

## References

- Roadmap: `M1-F05 | Step: Origin & Background`
- Step meta: `src/lib/character-form/steps.ts` (`id: "origin"`)
- Schema pattern: `src/lib/character-form/schema.ts`
- UI reference: `src/components/character-form/basic-info-fields.tsx`
