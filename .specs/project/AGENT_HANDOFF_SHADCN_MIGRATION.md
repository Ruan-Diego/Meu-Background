# Agent handoff: shadcn/ui form migration (stopped mid-wrap-up)

This file is for the **next agent** to resume work. Do not treat it as product documentation.

## Branch and git state

- **Branch:** `feature/m1-shadcn-form-primitives` (from `main`)
- **Status:** **Committed** (`feat(M1): adopt shadcn form primitives for character wizard`). Lint warnings in `personality-traits-fields.tsx` cleared by using `getValues` in chip callbacks.
- **Workflow (project rules):** Ask the user about merging into `main` and pushing when they are ready.

## What was implemented (matches adoption plan)

1. **shadcn CLI components added** (Base UI / base-nova style):  
   `input`, `label`, `textarea`, `select`, `progress`, `toggle`, `badge` under [`src/components/ui/`](../../src/components/ui/).

2. **Shared form helpers:**  
   - [`src/components/character-form/form-field-parts.tsx`](../../src/components/character-form/form-field-parts.tsx) — `FieldGroup`, `FieldError`, `inputFieldClassName`, `textareaFieldClassName`  
   - [`src/components/character-form/rhf-select-fields.tsx`](../../src/components/character-form/rhf-select-fields.tsx) — `RhfCountrySelect` (empty value → sentinel `__empty__` → `""` in RHF), `RhfEnumStringSelect` (fear level)

3. **Migrated screens:**  
   - [`basic-info-fields.tsx`](../../src/components/character-form/basic-info-fields.tsx) — `Input` + shared field parts  
   - [`origin-background-fields.tsx`](../../src/components/character-form/origin-background-fields.tsx) — `Input`, `Textarea`, `RhfCountrySelect`; **região** still uses `Input` + `<datalist>` (per plan)  
   - [`personality-traits-fields.tsx`](../../src/components/character-form/personality-traits-fields.tsx) — `Input`, `Textarea`, `Toggle` (preset chips), `Badge` + `Button` (custom chips), `RhfEnumStringSelect` for medo intensidade

4. **Progress + step rail:**  
   - [`form-progress.tsx`](../../src/components/character-form/form-progress.tsx) — `Progress` from UI; **`"use client"`** added (depends on client `Progress`)  
   - [`step-rail.tsx`](../../src/components/character-form/step-rail.tsx) — step cells use shadcn `Button` (`variant="ghost"`) with layout overrides

5. **Small UI tweak:** [`src/components/ui/progress.tsx`](../../src/components/ui/progress.tsx) — track height `h-1` → `h-2` for parity with the old bar.

## Intentionally not done (per plan)

- **`form` component** from shadcn CLI did not add a separate `form.tsx` (optional in plan; RHF uses `register` / `Controller` as implemented).
- **Alert** for wizard root error, **NavigationMenu** for header — deferred as optional.
- **Card** not re-pulled from registry (avoid visual drift).

## Verification already run

- `npm run build` — **success** (Next.js 16.2.2).
- `npm run lint` — **exit 0**, **no warnings** (after `getValues`-based chip callbacks).

## What the next agent should do

1. **Manual QA on `/criar`:** all steps, validation messages, país select + empty state, medo intensidade select, chips, keyboard shortcuts (Ctrl+Shift+arrows per wizard), progress bar layout.
2. **Merge / push:** follow [`.cursor/rules/git-workflow.mdc`](../../.cursor/rules/git-workflow.mdc) if the user approves merging `feature/m1-shadcn-form-primitives` into `main` and pushing.
3. **Cursor todos:** if the session still has a pending “verify /criar” item, mark it completed after QA (or cancel if redundant).

## Reference

- Original plan inventory: user’s `shadcn_ui_migration` plan (do not edit that file unless the user asks).
