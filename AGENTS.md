# Agent guide — Meu Background

Use this file as a **map**: where to read first, what each doc is for, and where enforceable rules live. **Do not** duplicate long policy here — Cursor loads `.cursor/rules/*.mdc` automatically when configured.

---

## 1. Next.js in this repo

<!-- BEGIN:nextjs-agent-rules -->
**This is NOT the Next.js you know.** This version can differ from older training data — APIs, conventions, and file layout included. Before changing routing, data fetching, or config, read the relevant guide under `node_modules/next/dist/docs/`. Treat deprecation notices as mandatory.
<!-- END:nextjs-agent-rules -->

---

## 2. Suggested reading order (new task or new session)

| Order | Path | Why open it |
|-------|------|----------------|
| 1 | `.specs/project/STATE.md` | **Current truth** for agents: what is shipped, stack, decisions, lessons, problems solved, TODOs. Updated after substantive work and after merges to `main` (see state rule). |
| 2 | `.specs/project/ROADMAP.md` | **Feature IDs** (`M1-F04`, …), milestone scope, definition of done. Canonical ordering of product work. |
| 3 | `.specs/project/PROJECT.md` | **Vision**, audience, product goals, narrative-guidance principles (incl. no-AI boundary). |
| 4 | `README.md` | **Local runbook**: install, `npm run dev`, test commands, high-level blurb. If README disagrees with `STATE.md` on versions or tooling, prefer **STATE** + `package.json`. |
| 5 | `.specs/features/<id>-<slug>/` | **Per-feature specs** (`spec.md`, `design.md`, `tasks.md`) when the task maps to a documented feature. Not every change has a folder — then infer from ROADMAP + code. |

After that, jump into `src/` with the task; use `STATE.md` pointers (e.g. `steps.ts`, `schema.ts`) for hot paths.

---

## 3. Enforceable rules (Cursor)

| Rule | Role |
|------|------|
| `.cursor/rules/git-workflow.mdc` | Branches from `develop`, commit/merge flow — **full detail is only here**. |
| `.cursor/rules/testing.mdc` | Vitest co-location, Cypress E2E, when to run tests, `data-ready` / `data-testid`. |
| `.cursor/rules/state-updates.mdc` | When and how to update `STATE.md` (including after merge to `main`). |

---

## 4. Quick links

- **Form flow:** `src/lib/character-form/steps.ts`
- **Validation / types:** `src/lib/character-form/schema.ts`
- **Client state:** `src/stores/character-store.ts`
- **E2E:** `cypress/e2e/*.cy.ts`
- **Deploy:** `.github/workflows/deploy-github-pages.yml`

---

## 5. `CLAUDE.md`

`CLAUDE.md` only references this file so other tools stay aligned with the same guide.
