# M2-F02 — i18n: English support

## Problem Statement

The product is **pt-BR first** (primary audience: Brazilian RPG players), but the roadmap commits to **English UI** as a first-class option in Milestone 2. Today, copy is embedded in components, step metadata, Zod messages, document builders, and layout metadata — all in Portuguese. Without structured i18n, international players and bilingual groups cannot use the app comfortably, and future locales would duplicate the same refactor.

## Goals

- [ ] Offer **two UI locales:** `pt-BR` (default) and `en`
- [ ] Let the user **switch language** without losing in-progress character data (same form state; only chrome language changes)
- [ ] Translate **all user-facing app strings**: marketing home, shell (nav, theme), wizard (steps, field labels, hints, buttons), validation errors, empty states, export controls, preview headings, toasts/errors — **excluding** free-text values the user typed (character name, notes, etc. stay as entered)
- [ ] Keep **exports and preview** aligned with the active locale (section titles, labels, “unnamed” placeholder, button descriptions — same semantic model as M1-F10 / M1-F11 / M1-F12 / M1-F13)
- [ ] Work with **static export** (`output: "export"`) and **`NEXT_BASE_PATH`** (GitHub Pages) without requiring a Node server at request time
- [ ] **Persist** the user’s locale choice across visits (same browser / origin)

## Out of Scope

| Topic | Reason |
| --- | --- |
| Additional locales beyond `en` | Roadmap names only pt-BR + English; add more only if ROADMAP is extended |
| Translating user-authored content | Player’s prose is not machine-translated |
| Locale-specific RPG systems or templates | **M4-F03** / future template work |
| SEO / Open Graph per locale | **M2-F05** |
| Formal WCAG audit of translated strings | **M2-F04** (still avoid obvious regressions) |
| RTL layout | Not required for pt-BR / en |
| Server-driven negotiation (`Accept-Language`) on static hosting | No edge/server; detection is client or URL-based only |

---

## User Stories

### P1: Locale switch and persistence

**User Story**: As a player who prefers English, I want to switch the interface to English and have that choice remembered when I return.

**Why P1**: Core M2-F02 outcome.

**Acceptance Criteria**:

1. WHEN the user selects **English** THEN all P1-covered UI strings SHALL render in English without a full page reload **or** with a single navigation that preserves form state (implementation choice per design)
2. WHEN the user selects **Portuguese (Brazil)** THEN the UI SHALL return to pt-BR strings
3. WHEN the user revisits the app in the same browser THEN the last selected locale SHALL apply before first meaningful paint **or** as soon as the locale provider hydrates without prolonged wrong-language flash (acceptable: brief flash if documented in design; prefer minimal flash)
4. WHEN the user switches locale mid-wizard THEN `CharacterFormValues` and `currentStepIndex` SHALL be unchanged (no reset of draft)

**Independent Test**: Fill step 1, switch locale, confirm data intact and labels change; reload, confirm locale and data.

---

### P1: Routed locales and static hosting

**User Story**: As a user sharing a link, I want English and Portuguese URLs to work on a static host so bookmarks and shared links open in the expected language.

**Why P1**: Static export cannot rely on Next middleware on GitHub Pages; URLs must resolve to pre-generated HTML.

**Acceptance Criteria**:

1. WHEN the site is built with `next build` (static export) THEN both `pt-BR` and `en` entry routes SHALL produce static output under the configured `basePath` (if any)
2. WHEN a user opens a deep link (e.g. create flow) in a given locale THEN that locale’s messages SHALL load for that route
3. WHEN `NEXT_BASE_PATH` is set THEN locale-prefixed paths SHALL still resolve (no broken assets or relative link bugs)

**Independent Test**: `npm run build` → inspect `out/` (or equivalent) for both locale trees; smoke open files locally.

---

### P1: Complete string coverage (app + validation + document surface)

**User Story**: As an English-speaking player, I should not see mixed Portuguese in the wizard, errors, preview, or downloads.

**Why P1**: “English support” implies full chrome, not partial.

**Acceptance Criteria**:

1. WHEN locale is `en` THEN Zod / form validation messages shown in the UI SHALL be English
2. WHEN locale is `en` THEN `FORM_STEPS` titles and descriptions (or their equivalents) SHALL be English in the step rail and step header
3. WHEN locale is `en` THEN field labels, placeholders, helper text, export step copy, and shell copy SHALL be English
4. WHEN locale is `en` THEN `buildCharacterDocument()`-driven preview and exports (Markdown, plain text, PDF) SHALL use English for **document chrome** (section titles, field labels, empty/placeholder semantics) consistent with the preview component
5. WHEN locale is `pt-BR` THEN behavior SHALL match current Portuguese UX (parity with today’s copy, modulo intentional copy tweaks filed separately)

**Independent Test**: Switch to `en`, walk all steps, trigger a validation error, export `.md` / `.txt` / `.pdf`, spot-check for Portuguese leakage.

---

### P2: Document language attribute

**User Story**: As a user with assistive technology or strict HTML semantics, I want `lang` on the document to reflect the active locale.

**Why P2**: Accessibility hygiene; small change.

**Acceptance Criteria**:

1. WHEN locale is `pt-BR` THEN the root `html` `lang` SHALL be `pt-BR` (or BCP 47 equivalent used consistently)
2. WHEN locale is `en` THEN `lang` SHALL be `en`

**Independent Test**: Inspect DOM after locale switch.

---

### P2: Testing and maintainability

**User Story**: As a maintainer, I want tests to catch missing translation keys so English does not silently fall back to wrong strings.

**Why P2**: Prevents drift as new fields ship.

**Acceptance Criteria**:

1. WHEN a new user-facing string is added THEN the change process SHALL include updating **both** locale message bundles (or a test fails)
2. WHEN `npm run test:ci` runs THEN at least one automated check SHALL validate **key parity** (or structural parity) between `pt-BR` and `en` message namespaces relevant to the app

**Independent Test**: Remove a key from `en` in a branch; unit test should fail.

---

## Edge Cases

- **Constants with Portuguese labels** (e.g. origin country names, personality chips): Either translate option labels per locale or explicitly document “proper nouns stay Portuguese” — **decision in design.md**; default expectation is **labels translate** if they are UI options, not user diary text.
- **Filenames for export**: Slug rules may stay ASCII; default basename when name is empty may use a translated word (e.g. `character` vs `personagem`) — align with existing `document-filename` tests and spec expectations.
- **localStorage persist** (character draft): Locale preference is separate from character draft; changing language must not clear draft (see P1).
- **First visit / no preference**: Default locale SHALL be `pt-BR` (product decision, matches STATE).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| I18N-01 | P1: Locale switch and persistence | Execute | Pending |
| I18N-02 | P1: Routed locales and static hosting | Execute | Pending |
| I18N-03 | P1: Complete string coverage | Execute | Pending |
| I18N-04 | P2: Document `lang` | Execute | Pending |
| I18N-05 | P2: Testing / key parity | Execute | Pending |

**Coverage:** 5 total, unmapped to tasks until `tasks.md` is executed.

---

## Success Criteria

- [ ] User can use the entire create flow in English with no Portuguese UI leakage in chrome, validation, preview, or exports
- [ ] `npm run build` succeeds with static export and both locales
- [ ] Locale preference survives reload; draft survives locale switch
- [ ] Automated test guards message bundle parity (I18N-05)

---

## Notes (non-normative)

- M1-F13 spec already anticipates sharing document strings with UI once i18n exists — reuse one message source for preview/export where practical.
- **M3** will add a large volume of coaching copy; structuring messages by namespace now (e.g. `steps`, `fields`, `export`, `document`, `validation`) reduces later churn.
