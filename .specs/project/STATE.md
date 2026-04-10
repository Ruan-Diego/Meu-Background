# State — Meu Background

> Persistent memory across sessions for **people and agents**. Keep this file aligned with reality: decisions, requirements, stack, problems solved, and lessons. Canonical feature list and sizing live in **`ROADMAP.md`**; this file is the **operational snapshot** and **agent onboarding** surface.

**Maintenance:** See Cursor rule `.cursor/rules/state-updates.mdc` — after substantive work, review whether STATE needs edits; after a merge to **`main`**, update STATE with everything that landed.

---

## Product fundamentals

- **What it is:** A client-side web app that guides tabletop RPG players through a **multi-step character backstory** (wizard), shows a **live document preview**, and **exports** the result (Markdown, plain text, PDF).
- **Primary audience:** Brazilian RPG community — **pt-BR first**; English is a Milestone 2 item (`M2-F02`).
- **Architecture:** **No app backend** for core flows. **Static export** (`output: "export"` in Next.js) for hosting on static targets (e.g. **GitHub Pages**).
- **Data:** Form state lives in the browser; **Zustand** with **localStorage** persistence (auto-save / restore on revisit — **M1-F14**, covered in E2E).

---

## Functional requirements (summary)

Source of truth for scope per milestone: **`ROADMAP.md`**. High-level MVP (M1) expectations:

| Area | Expectation |
|------|-------------|
| **Wizard** | Ordered steps with validation per step, navigation (incl. keyboard where implemented), progress indication. |
| **Steps (M1)** | Basic info → Origin & background (incl. family/ties) → Personality → Goals → Appearance (beyond miniatura; MVP = open fields + Hero Forge link) → Free notes → Export. |
| **Preview** | Live preview of the composed character document while editing. |
| **Export** | Download **.md**, **.txt**, and **.pdf** (PDF via `@react-pdf/renderer`). |
| **Persistence** | Survive refresh via local persistence (Zustand + storage). |

**Explicitly not in MVP (M1):** Rich per-field coaching, AI-generated suggestions, expandable help panels — see **Milestone 3** in ROADMAP.

---

## Non-functional requirements

| Topic | Target / note |
|-------|----------------|
| **Hosting** | Static bundle; `basePath` / `assetPrefix` via **`NEXT_BASE_PATH`** for GitHub Project Pages (`/<repo>`). |
| **Privacy** | No server-side storage of character data in the core design; data stays on the client. |
| **Accessibility** | WCAG-oriented work is **M2-F04**; do not assume MVP is fully audited. |
| **i18n** | pt-BR default; EN later (`M2-F02`). |
| **Testing** | **Vitest** (unit) and **Cypress** (E2E) are implemented in-repo; see `.cursor/rules/testing.mdc`. **CI today:** deploy workflow only — **tests are not yet run in GitHub Actions** (still a gap vs ideal pipeline). |

---

## Business & product rules

- **No AI / ML** in product plans for narrative generation — guidance is **editorial, in-app** (Milestone 3). “Not planned” in roadmap: AI-powered backstory suggestions.
- **MVP coaching boundary:** Structural guidance (steps, order, required flow) only until M3; avoid scope creep into M3 copy/coaching in M1/M2 unless roadmap is updated.
- **Appearance step:** MVP ships as **open text areas** + Hero Forge link; richer facilitation is **M3-F07** (see Decisions Log).

---

## Stack & tooling (current)

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js **16.x** (App Router), **React 19**, TypeScript |
| **Styling** | Tailwind CSS v4, design tokens in `globals.css`, **shadcn/ui**-style components (Radix / Base UI as used in repo) |
| **Forms** | **React Hook Form** + **Zod** (`@hookform/resolvers`) |
| **Client state** | **Zustand** (+ persist middleware) |
| **PDF** | `@react-pdf/renderer` |
| **Motion** | `framer-motion` (M2 transitions; may already be present as dependency) |
| **Theme** | `next-themes`, class-based dark mode |

**Commands (local):**

- `npm run dev` — dev server  
- `npm run build` — production static export to `out/`  
- `npm run test:ci` — Vitest once  
- `npm run test:e2e` — dev server + Cypress headless  

**Deploy:** `.github/workflows/deploy-github-pages.yml` — on push to **`main`**, `npm ci` + `npm run build` with `NEXT_BASE_PATH: /<repo>`.

> **Note:** Older docs may say “Next.js 15”; the **decision** remains *static export, no backend for core app* — the **runtime** is Next 16 as in `package.json`.

---

## Conventions & where things live

| Topic | Location |
|-------|----------|
| Roadmap & feature IDs | `.specs/project/ROADMAP.md` |
| Feature specs | `.specs/features/` (e.g. M1-F13 PDF spec when applicable) |
| Form steps order / IDs | `src/lib/character-form/steps.ts` |
| Zod model & per-step validation | `src/lib/character-form/schema.ts` |
| Character store | `src/stores/character-store.ts` |
| Git branches | `feature/<milestone>-<short-kebab-case>` from `develop` — `.cursor/rules/git-workflow.mdc` |
| Agent / testing rules | `.cursor/rules/` |
| Cypress E2E specs | `cypress/e2e/*.cy.ts` |
| Unit tests (Vitest) | Co-located `*.test.ts` next to sources under `src/` |

---

## Milestone 1 — delivered

**Status: complete** (functionality + test baseline). Scope and IDs: **`ROADMAP.md`** (Milestone 1).

| ID | Feature | Shipped notes |
|----|---------|----------------|
| M1-F01 | Project scaffolding | Next.js App Router, TS, Tailwind, Zustand, RHF — see `package.json` / `src/app/`. |
| M1-F02 | Design system & layout | App shell, theme toggle, tokens — `src/components/layout/`, `globals.css`. |
| M1-F03 | Multi-step form engine | `character-form-wizard.tsx`: step order, progress, per-step Zod validation, **ArrowLeft/ArrowRight** on document for prev/next. |
| M1-F04 | Step: Basic Info | `basic-info-fields.tsx` (+ schema slice). |
| M1-F05 | Step: Origin & Background | `origin-background-fields.tsx`, relatives, origin constants. |
| M1-F06 | Step: Personality & Traits | `personality-traits-fields.tsx`, chip options / fear levels. |
| M1-F07 | Step: Goals & Motivations | `goals-motivations-fields.tsx` (+ schema slice). |
| M1-F08 | Step: Appearance | `appearance-fields.tsx` — open fields + Hero Forge link (M3-F07 tracks richer UX). |
| M1-F09 | Step: Free Notes | `free-notes-fields.tsx` — addable topic + description rows. |
| M1-F10 | Document preview | `DocumentPreview` beside wizard on `/criar`. |
| M1-F11 | Export Markdown | `markdown-export-button.tsx` + `document-markdown.ts`. |
| M1-F12 | Export plain text | `plain-text-export-button.tsx` + `document-plain-text.ts`. |
| M1-F13 | Export PDF | `pdf-export-button.tsx` + `generate-character-pdf` (see `.specs/features/m1-f13-export-pdf/` when extending). |
| M1-F14 | Auto-save (localStorage) | Zustand persist in `character-store.ts`; E2E covers reload restore. |

**M1 Definition of Done (roadmap):** User can open the site, complete all steps, see live preview, download **.md / .txt / .pdf**, and data survives refresh — **implemented**.

---

## Test suite (implemented)

### Unit — Vitest (`npm run test:ci`)

Co-located `*.test.ts` files:

| Area | File |
|------|------|
| Store / persist | `src/stores/character-store.test.ts` |
| Step metadata | `src/lib/character-form/steps.test.ts` |
| Zod model & step validation | `src/lib/character-form/schema.test.ts` |
| Document structure → sections | `src/lib/character-form/document-sections.test.ts` |
| Markdown export | `src/lib/character-form/document-markdown.test.ts` |
| Plain text export | `src/lib/character-form/document-plain-text.test.ts` |
| Download filenames | `src/lib/character-form/document-filename.test.ts` |

### E2E — Cypress (`npm run test:e2e`)

| Spec | Covers |
|------|--------|
| `cypress/e2e/landing.cy.ts` | Home hero, CTA → `/criar`, anchor scroll |
| `cypress/e2e/character-wizard.cy.ts` | Validation on basic step, back/next field retention, full path to export step + Markdown button visible |
| `cypress/e2e/auto-save.cy.ts` | Draft name restored after reload (persist flush) |

**Selectors / hydration:** Prefer `data-testid` where present; forms that depend on Zustand persist wait on **`form[data-ready]`** before interaction (see specs above).

---

## Implementation snapshot (rolling)

_Last reviewed: 2026-04-10. **Milestone 1 is complete;** next roadmap tranche is **Milestone 2** unless priorities change._

- **Wizard:** **7** steps — basic → origin → personality → goals → appearance → freeNotes → **export** (live preview + three download formats).
- **Schema:** Zod-backed model and per-step validation in `schema.ts` — extend when adding fields or steps.
- **Exports:** Markdown, plain text, and PDF buttons on export step (`markdown-export-button`, `plain-text-export-button`, `pdf-export-button`).
- **GitHub Pages:** Production build uses `NEXT_BASE_PATH` = `/<repo>` in CI when deploying.

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-10 | **Milestone 1** treated as **done** in codebase: all M1-F01–F14 behaviors present plus **Vitest** + **Cypress** baselines | Matches ROADMAP M1 DoD; agents should start new work from **M2** unless explicitly fixing M1 regressions |
| 2026-04-07 | M1-F08 (Appearance / comportamento além da miniatura) ships as open text areas + Hero Forge link; UX debt is explicit in UI and specs | MVP scope limits coaching; the product requirement is to *facilitate* writing — this step is flagged for M3-style prompts, examples, and structure (see **M3-F07** in ROADMAP) |
| 2026-04-07 | No standalone “Step: Relationships” in the wizard or roadmap; former M1-F08–F15 renumbered to M1-F07–F14 | Family and relationship ties live in step 2 (Origin & Background) via `relatives[]`; the old empty Relationships step duplicated that intent |
| 2026-04-07 | Theme switching uses `next-themes` with class-based dark mode | Keeps App Router theming simple, avoids custom hydration work, and matches the token strategy in `globals.css` |
| 2026-04-06 | Next.js with **static export** | No backend needed; deploy to any static host; React 19 ecosystem |
| 2026-04-06 | Zustand over Context API | Simpler API for cross-step state; built-in localStorage middleware |
| 2026-04-06 | React Hook Form + Zod | Best multi-step form DX; Zod gives runtime + compile-time safety |
| 2026-04-06 | @react-pdf/renderer for PDF | True PDF generation client-side; no server dependency |
| 2026-04-06 | shadcn/ui over Chakra/MUI | Tailwind-native, copy-paste ownership, accessible Radix primitives |
| 2026-04-06 | pt-BR first language | Primary audience is Brazilian RPG community |
| 2026-04-06 | No AI in product plans | Guidance is editorial/in-app only; narrative coaching is a major roadmap theme (Milestone 3), not machine-generated suggestions |

---

## Blockers

_None currently._

---

## Lessons learned

- **GitHub Pages + static export:** Production builds for Project Pages need **`NEXT_BASE_PATH`** set to `/<repository-name>` so assets and routes resolve; see `next.config.ts` and `deploy-github-pages.yml`.
- **Next.js in this repo:** Follow project guidance to read **`node_modules/next/dist/docs/`** when APIs differ from older Next.js versions (see `AGENTS.md`).
- **Cypress + Zustand persist:** Specs visit `/` then `/criar` with cleared storage so a prior test’s unmount can flush persist before the next run. Wait for **`form[data-ready]`** before typing. **`pagehide`** is used in auto-save E2E to encourage persist flush before `reload()`.

---

## Problems solved (archive)

_Short entries: symptom → cause → fix. Newest first._

| Date | Problem | Resolution |
|------|---------|------------|
| — | — | _None recorded yet._ |

---

## Planned improvements (tracked)

- **Appearance step (M1-F08):** Evolve from textarea-only toward question prompts, optional static examples, expandable “how to fill” copy, progressive disclosure, and/or smaller structured fields — aligned with Milestone 3 narrative guidance. Microcopy and motion polish may appear in M2 where they do not duplicate M3 coaching scope.

---

## Deferred ideas

- Collaborative party backstory editing
- Print-optimized CSS as alternative to PDF
- Offline PWA support

**Not planned:** AI-powered or ML-generated backstory suggestions.

---

## TODOs

- [x] Build design system & layout (M1-F02)
- [x] Scaffold Next.js project (M1-F01)
- [x] Define character data schema (Zod) — baseline in `src/lib/character-form/schema.ts` (extend as roadmap adds fields)
- [x] GitHub Actions workflow for **deploy** to GitHub Pages on `main`
- [x] **Milestone 1** feature set (M1-F01–F14) per ROADMAP
- [x] **Unit tests** (Vitest) — baseline modules listed under *Test suite*
- [x] **E2E tests** (Cypress) — landing, wizard, auto-save
- [ ] Run **lint/tests in CI** (workflow still deploy-only as of 2026-04-10)
- [ ] **Milestone 2** (or next prioritized roadmap slice) — see `ROADMAP.md`

---

## Preferences

- Lightweight tasks (validation, state updates) work well with faster/cheaper models.
- **M1-F13 (PDF export):** When implementing or extending, use branch `feature/m1-f13-export-pdf-spec` and the spec at `.specs/features/m1-f13-export-pdf/spec.md` when that spec applies.
