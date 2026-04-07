# M1-F05 — Step: Origin & Background

## Goal

Implement the second wizard step (`origin` / “Origem e histórico”) so players can record **local de origem** (país, região, cidade), **parentes repetíveis** (vínculo, nome, background opcional revelado por botão) and **eventos marcantes repetíveis** — using the same stack as M1-F04 (React Hook Form, Zod, Zustand draft, per-step validation). **Ocupação atual** lives on step 1 (Informações básicas); see `BasicInfoFields` and `stepSchemas.basic`.

## Problem

The wizard needs a structured place for origem e histórico beyond nome/idade/classe. This feature defines the **cenário** (lista de países, sugestões de região + texto livre), **vínculos familiares** com número variável de linhas, e **eventos formativos** como linhas adicionáveis.

## Requirements

- `ORIG-001` The `origin` step SHALL render dedicated sections (layout and a11y consistent with `BasicInfoFields`: labels, inputs, `aria-invalid` / `aria-describedby`, error text).
- `ORIG-002` **Local de origem** (schema keys):
  - **País** (`birthCountry`) — `<select>`; values from `ORIGIN_COUNTRY_OPTIONS` in `origin-constants.ts`, plus empty “Selecione…”.
  - **Região** (`birthRegion`) — text with `<datalist>` suggestions (`ORIGIN_REGION_SUGGESTIONS`); user MAY type any region.
  - **Cidade** (`birthCity`) — short text.
- `ORIG-003` **Parentes e vínculos** — `relatives[]` with `{ kinship, name, background }` (implementation keys). UI labels: **Vínculo**, **Nome**, **Background**. Background is optional in Zod; the UI shows **Adicionar background** until the user expands it or draft already has non-whitespace `background` (then the field is shown, label **Background** without “(opcional)”).
- `ORIG-004` **Eventos marcantes** — `shapingEvents[]` with `{ eventName, myAge, description }`; add/remove rows; all optional at milestone level (trim).
- `ORIG-005` **Ocupação atual** (`occupation`) is part of **step 1** (`basic`): included in `basicStepSchema`, `STEP_FIELD_PATHS.basic`, and `BasicInfoFields`. It is NOT part of `originStepSchema` or `OriginBackgroundFields`.
- `ORIG-006` All origin (and occupation) fields above remain **optional** in Zod where not otherwise required (only `characterName` stays required globally). Empty strings after trim; advancing MUST NOT be blocked by empty origin rows.
- `ORIG-007` `characterFormSchema`, `defaultCharacterFormValues`, `stepSchemas.origin`, `getTriggerPathsForStepIndex` (dynamic array paths), and `validateStepValues` SHALL keep origin validation and RHF `trigger` in sync.

## Out of scope

| Item | Reason |
|------|--------|
| Rich placeholders, hints, “como preencher”, examples | Milestone 3 (M3-F01–F04) |
| Campaign locks beyond fixed country list | Future templates (M4) |
| Export / preview body content | M1-F10+ consume the same schema keys |

## Acceptance criteria (WHEN / THEN)

1. WHEN the user is on step 2 THEN the UI SHALL show local de origem, parentes adicionáveis, and eventos adicionáveis as specified.
2. WHEN the user is on step 1 THEN **Ocupação atual** SHALL appear with the other basic fields.
3. WHEN the user adds a parent row THEN **Vínculo** and **Nome** appear; **Background** appears only after **Adicionar background** or when restored text is non-empty.
4. WHEN the user leaves origin fields empty (and basic required fields satisfied) THEN **Próxima** SHALL not be blocked by Zod for origin.
5. WHEN values are trimmed in `schema.ts` THEN whitespace-only input SHALL normalize to empty.

## Verification

- Manual: `/criar` — step 1 includes ocupação; step 2 país/região/cidade, add/remove parentes and eventos, background toggle; navigate next/previous; no console errors; draft keys match `CharacterFormValues`.

## Requirement traceability

| ID | Status |
|----|--------|
| ORIG-001 | Done |
| ORIG-002 | Done |
| ORIG-003 | Done |
| ORIG-004 | Done |
| ORIG-005 | Done |
| ORIG-006 | Done |
| ORIG-007 | Done |

## References

- Roadmap: `M1-F05 | Step: Origin & Background`
- Step meta: `src/lib/character-form/steps.ts` (`id: "origin"`)
- Schema: `src/lib/character-form/schema.ts`
- Constants: `src/lib/character-form/origin-constants.ts`
- UI: `src/components/character-form/origin-background-fields.tsx`, `basic-info-fields.tsx`
