# M2-F02 — i18n English support: Task Breakdown

Tasks are ordered by dependency. Branch naming per project workflow: `feature/m2-f02-i18n-english-support` from `develop`. Each task should include tests where noted; run `npm run test:ci` before merge.

## Task index → Requirements

| Task | I18N-01 | I18N-02 | I18N-03 | I18N-04 | I18N-05 |
| --- | --- | --- | --- | --- | --- |
| T1 Routing + static locales | ● | ● | | ● | |
| T2 Message infra + provider | ● | | ● | ● | |
| T3 Migrate shell + home | ● | | ● | | |
| T4 Steps + wizard chrome | ● | | ● | | |
| T5 Field components + export step UI | ● | | ● | | |
| T6 Schema factory + validation i18n | ● | | ● | | ● |
| T7 Document builder + preview + exports | ● | | ● | | |
| T8 Locale switcher + persistence | ● | | | | |
| T9 Tests (parity, E2E) + build smoke | ● | ● | ● | ● | ● |

---

### T1 — Introduce `[locale]` segment and static params

**Goal:** All user-facing routes live under `/[locale]/…`; static export emits both locales; `html lang` wired from segment.

**Steps:**

1. Add `src/lib/i18n/config.ts` (or equivalent) exporting `const locales = ['pt-BR', 'en'] as const`, `defaultLocale = 'pt-BR'`, type `Locale`.
2. Create `src/app/[locale]/layout.tsx`: validate `locale` param, set `<html lang={locale}>`, nest existing providers (theme, shell) per current root layout.
3. Move `src/app/page.tsx` → `src/app/[locale]/page.tsx`; move `src/app/criar/page.tsx` → `src/app/[locale]/criar/page.tsx`.
4. Add `src/app/page.tsx` (root) that redirects to `/${defaultLocale}` **or** client fallback per `design.md` §3.1 after verifying static export.
5. Export `generateStaticParams` returning both locales from `[locale]` layout (or shared module).
6. Update all internal `Link href` / `router.push` usages to locale-aware paths; respect `next.config` `basePath` (Next handles basePath on `Link` — verify manually).

**Verification:**

- [ ] `npm run dev`: `/pt-BR` and `/en` (or default redirect) open home and `/criar`.
- [ ] `npm run build` completes; `out/` contains both locale paths (exact structure depends on Next export).
- [ ] With `NEXT_BASE_PATH` set locally, smoke test paths if feasible.

**Maps to:** I18N-02, I18N-04 (partial until provider lands).

---

### T2 — Message files + i18n provider

**Goal:** Central dictionaries for `pt-BR` and `en`; app can call `useTranslations` (or project hook) in client components.

**Steps:**

1. Add `messages/pt-BR.json` and `messages/en.json` with initial namespaces (`meta`, `common`, …) — can start minimal and grow in T3–T7.
2. Install and configure **`next-intl`** (recommended) **or** implement `LocaleProvider` + `useT()` reading JSON by locale.
3. Wire provider in `[locale]/layout.tsx` with messages loaded for the current segment (server load + pass to client provider pattern per library docs).

**Verification:**

- [ ] One demo string in layout or home reads from messages in both locales.
- [ ] No server/client console errors on `/pt-BR` and `/en`.

**Maps to:** I18N-01, I18N-03, I18N-04.

---

### T3 — Migrate shell and marketing home

**Goal:** `AppShell`, navigation, theme labels, and `src/app/[locale]/page.tsx` content use messages only (no hardcoded Portuguese in those files).

**Steps:**

1. Replace literals in `src/components/layout/*` and home page with translation keys.
2. Implement `generateMetadata` for `[locale]/layout` using `meta` namespace (title, description).

**Verification:**

- [ ] Visual check: home and header in `en` are English; `pt-BR` matches previous Portuguese intent.

**Maps to:** I18N-03.

---

### T4 — Wizard steps metadata and step chrome

**Goal:** Step titles/descriptions and wizard-only UI strings (progress, keyboard hints, review messaging) come from messages; `steps.ts` stays structural.

**Steps:**

1. Refactor `FORM_STEPS` to exclude localized `title`/`description` **or** build step meta from `step.id` + messages in the wizard.
2. Update `character-form-wizard.tsx` and related components to use translations.
3. Update `steps.test.ts` to assert ids, order, and count — not localized strings.

**Verification:**

- [ ] `npm run test:ci` — steps tests green.
- [ ] Wizard step rail and headers show English on `/en/criar`.

**Maps to:** I18N-01, I18N-03.

---

### T5 — Field components + export step controls

**Goal:** All form field labels, placeholders, section headings, and export button labels/descriptions are translated.

**Steps:**

1. Migrate `basic-info-fields`, `origin-background-fields`, `personality-traits-fields`, `goals-motivations-fields`, `appearance-fields`, `free-notes-fields`, and any shared `FieldGroup` usage.
2. Migrate export step copy in wizard (Markdown / TXT / PDF descriptions, errors).
3. Migrate option labels in constants files where those labels are user-facing (see `design.md` §3.9).

**Verification:**

- [ ] Manual pass: each step in `en` without Portuguese UI.
- [ ] Add or update component tests only where high value (optional small tests for pure label helpers).

**Maps to:** I18N-03.

---

### T6 — Zod schema factory + localized validation

**Goal:** Validation messages are English in `en` locale; Portuguese in `pt-BR`.

**Steps:**

1. Extract validation copy to messages (`validation` namespace) or typed `ValidationMessages` object.
2. Implement `createCharacterFormSchema(messages)` (name per codebase) returning current schema shape with localized strings; export a default Portuguese instance for backward compatibility during migration **or** wire locale only through provider + single schema in RHF — prefer one clear pattern.
3. Ensure `superRefine` / step validation messages use the same source.
4. Update `schema.test.ts` to cover English + Portuguese error text for representative rules.

**Verification:**

- [ ] `npm run test:ci` — schema tests green.
- [ ] Submit empty required field on basic step in EN → English message.

**Maps to:** I18N-01, I18N-03, I18N-05.

---

### T7 — Document pipeline (builder, preview, MD, TXT, PDF)

**Goal:** Preview and all exports use the active locale for document chrome.

**Steps:**

1. Refactor `buildCharacterDocument()` to accept localized labels (object or `t` callback) for section titles, block labels, and placeholders like “Sem nome” / “Unnamed”.
2. Update `document-preview.tsx`, `document-markdown.ts`, `document-plain-text.ts`, and PDF mapping (`document-pdf.tsx` or equivalent) to use the same label source.
3. Update `document-sections.test.ts`, `document-markdown.test.ts`, `document-plain-text.test.ts`, and PDF tests if any — pass English labels in new tests or parametrize.

**Verification:**

- [ ] Export `.md` in `en` shows English section headings; `pt-BR` unchanged semantically.
- [ ] `npm run test:ci` green.

**Maps to:** I18N-03.

---

### T8 — Locale switcher + `localStorage` preference

**Goal:** User can switch language; preference persists; character draft unaffected.

**Steps:**

1. Add UI control (e.g. header dropdown or toggle) listing Português (Brasil) / English.
2. On change, navigate to same path under the other locale (preserve path + query) using `usePathname` + string replace or `next-intl` router.
3. Persist choice to `localStorage`; on future full page loads from root redirect, read preference (if using client root fallback, align with `design.md`).

**Verification:**

- [ ] Fill name on step 1, switch to EN, name still present.
- [ ] Reload, locale persists.

**Maps to:** I18N-01.

---

### T9 — Key parity test, E2E touch-up, production build

**Goal:** Prevent missing keys; CI-ready verification.

**Steps:**

1. Add Vitest test `messages/parity.test.ts` (or under `src/lib/i18n/`) that recursively compares key sets of `pt-BR.json` and `en.json`.
2. Update Cypress `landing.cy.ts` / `character-wizard.cy.ts` to visit locale-prefixed paths (`/pt-BR/...` or default strategy from T1); add minimal `en` assertion (e.g. `lang` or one heading).
3. Run `npm run build` (optionally with `NEXT_BASE_PATH` in env) and fix any broken paths.

**Verification:**

- [ ] `npm run test:ci` green.
- [ ] `npm run test:e2e` green (or document skip if basePath makes local E2E require env — then document in STATE).
- [ ] `npm run build` green.

**Maps to:** I18N-02, I18N-05, and full regression on I18N-03 / I18N-04.

---

## Suggested commits (atomic where possible)

1. `feat(M2-F02): add locale routing and static params`
2. `feat(M2-F02): add message dictionaries and i18n provider`
3. `feat(M2-F02): localize shell and home`
4. `feat(M2-F02): localize wizard steps and form fields`
5. `feat(M2-F02): localize validation and document exports`
6. `feat(M2-F02): add locale switcher and persistence`
7. `test(M2-F02): message parity and E2E locale paths`
