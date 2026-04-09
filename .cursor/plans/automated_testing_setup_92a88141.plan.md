---
name: Automated Testing Setup
overview: Set up Vitest for unit tests covering the pure logic layer (schema, document builders, filename slugs, step helpers) and Cypress for E2E tests covering the landing page, the full character-creation wizard flow, and export functionality.
todos:
  - id: setup-vitest
    content: Install Vitest deps, create vitest.config.ts, add test scripts to package.json
    status: completed
  - id: test-filename
    content: Unit tests for document-filename.ts (slugify, filename generators)
    status: completed
  - id: test-steps
    content: Unit tests for steps.ts (clampStepIndex)
    status: completed
  - id: test-schema
    content: Unit tests for schema.ts (validation, mergeInitialFormValues, validateStepValues, getTriggerPathsForStepIndex)
    status: completed
  - id: test-doc-sections
    content: Unit tests for document-sections.ts (buildCharacterDocument)
    status: completed
  - id: test-doc-markdown
    content: Unit tests for document-markdown.ts (characterDocumentToMarkdown)
    status: completed
  - id: test-doc-plaintext
    content: Unit tests for document-plain-text.ts (characterDocumentToPlainText)
    status: completed
  - id: test-store
    content: Unit tests for character-store.ts (Zustand actions)
    status: completed
  - id: run-unit-tests
    content: Run all unit tests, fix any failures
    status: completed
  - id: setup-cypress
    content: Install Cypress, create cypress.config.ts, tsconfig, add scripts
    status: completed
  - id: e2e-landing
    content: "E2E test: landing page loads, CTA navigation"
    status: completed
  - id: e2e-wizard
    content: "E2E test: full wizard flow, validation, step navigation"
    status: completed
  - id: e2e-autosave
    content: "E2E test: auto-save persistence across reload"
    status: completed
  - id: run-e2e-tests
    content: Run E2E tests against dev server, fix any failures
    status: pending
  - id: create-testing-rule
    content: Create .cursor/rules/testing.mdc rule enforcing test best practices and requiring tests for every new feature
    status: pending
  - id: git-commit
    content: Create branch, commit, ask about merge to develop
    status: pending
isProject: false
---

# Automated Testing: Unit (Vitest) + E2E (Cypress)

## Phase 1 -- Unit tests with Vitest

### Why Vitest over Jest

- Native ESM + TypeScript support (no babel config)
- Understands the `@/*` path alias from [tsconfig.json](tsconfig.json) out of the box via `vite-tsconfig-paths`
- Fastest setup for a modern Next.js + React 19 project
- Compatible with `@testing-library/react` for future component tests

### Dependencies to install

```
vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom jsdom
```

### Configuration

- Create `vitest.config.ts` at the root, extending from Vite, setting `environment: 'jsdom'`, adding `vite-tsconfig-paths` and `@vitejs/plugin-react` plugins
- Add `"test": "vitest"` and `"test:ci": "vitest run"` scripts to `package.json`

### Test files to create (colocated next to source)

All these target **pure functions** with zero mocking needed:

1. **`src/lib/character-form/document-filename.test.ts`**
   - `slugifyBasenameFromName`: empty string, accented names, special chars, whitespace-only
   - `characterDocumentMarkdownFilename`, `*PlainTextFilename`, `*PdfFilename`: correct extensions

2. **`src/lib/character-form/steps.test.ts`**
   - `clampStepIndex`: negative, zero, in-range, overflow, NaN

3. **`src/lib/character-form/schema.test.ts`**
   - `characterFormSchema.parse`: valid minimal data, missing `characterName` (required), full data
   - `mergeInitialFormValues`: empty draft, legacy keys stripped, malformed arrays coerced, invalid data falls back to defaults
   - `validateStepValues`: each step returns `ok: true` on valid data, `ok: false` on invalid
   - `getTriggerPathsForStepIndex`: basic step (static paths), origin step (dynamic with relatives/events), out-of-range index

4. **`src/lib/character-form/document-sections.test.ts`**
   - `buildCharacterDocument`: default values produce `isEmpty: true`, minimal filled data produces correct header + sections, all sections populated

5. **`src/lib/character-form/document-markdown.test.ts`**
   - `characterDocumentToMarkdown`: empty doc output, document with all section types, markdown escaping of special chars

6. **`src/lib/character-form/document-plain-text.test.ts`**
   - `characterDocumentToPlainText`: empty doc, full doc, correct heading underlines

7. **`src/stores/character-store.test.ts`**
   - `setDraft`, `setCurrentStepIndex`, `reset` actions

---

## Phase 2 -- E2E tests with Cypress

### Dependencies to install

```
cypress
```

### Configuration

- `cypress.config.ts` at the root: `baseUrl: 'http://localhost:3000'`, `e2e.specPattern: 'cypress/e2e/**/*.cy.ts'`
- `cypress/tsconfig.json` extending the root one with Cypress types
- Add `"cypress:open": "cypress open"` and `"cypress:run": "cypress run"` scripts

### E2E test files

1. **`cypress/e2e/landing.cy.ts`**
   - Landing page loads, shows hero title and CTA
   - "Comecar agora" CTA navigates to `/criar`
   - "Como funciona" anchor scrolls to highlight cards section

2. **`cypress/e2e/character-wizard.cy.ts`**
   - Full wizard flow: fill basic info -> advance through all steps -> reach export step
   - Required field validation: try to leave step 1 without `characterName`, see error
   - Step navigation: go forward and back, data persists between steps

3. **`cypress/e2e/auto-save.cy.ts`**
   - Fill some data, reload page, data is restored from localStorage

---

## File structure summary

```
vitest.config.ts                              (new)
cypress.config.ts                             (new)
cypress/
  tsconfig.json                               (new)
  e2e/
    landing.cy.ts                             (new)
    character-wizard.cy.ts                    (new)
    auto-save.cy.ts                           (new)
src/lib/character-form/
  document-filename.test.ts                   (new)
  steps.test.ts                               (new)
  schema.test.ts                              (new)
  document-sections.test.ts                   (new)
  document-markdown.test.ts                   (new)
  document-plain-text.test.ts                 (new)
src/stores/
  character-store.test.ts                     (new)
```

## Phase 3 -- Cursor rule for testing standards

### Purpose

Create an **always-applied** Cursor rule (`.cursor/rules/testing.mdc`) that ensures every future feature includes proper tests. This rule will be automatically picked up by the agent in every conversation, so tests are never forgotten.

### Rule file

- Path: `.cursor/rules/testing.mdc`
- `alwaysApply: true` (active in every session, not just when test files are open)

### Rule content outline

The rule will enforce the following:

**General principles**
- Every new feature or bug fix **must** include tests before the branch is considered complete
- Tests live **colocated** with their source files (`*.test.ts` next to the module) for unit tests; E2E tests go in `cypress/e2e/`
- Prefer testing **behavior and contracts**, not implementation details
- Tests must be deterministic -- no reliance on network, timers, or randomness without explicit mocking

**Unit tests (Vitest)**
- Use `describe` / `it` blocks with descriptive names that read like sentences
- Cover at minimum: happy path, edge cases (empty input, boundary values), and error/validation paths
- For pure functions: test input-output directly, no mocking needed
- For stores (Zustand): test actions and resulting state transitions
- For React components (future): use `@testing-library/react`, query by role/label, never by CSS class

**E2E tests (Cypress)**
- One spec per user-facing flow or page
- Use `data-testid` attributes for selectors when semantic selectors are not possible
- Avoid `cy.wait(ms)` -- use Cypress built-in retry/assertion instead
- Test the critical user journey, not every visual detail

**Naming conventions**
- Unit test files: `<module-name>.test.ts` (colocated)
- E2E test files: `cypress/e2e/<feature-name>.cy.ts`
- Test descriptions: `describe('<ModuleName>', () => { it('should <expected behavior> when <condition>', ...) })`

**Agent behavior**
- When implementing a new feature: after the production code is written, create or update the corresponding test files **on the same branch, in the same commit**
- Before marking a feature as complete: run `pnpm test` (unit) and verify no regressions
- If a feature touches UI flows: add or update a Cypress spec in `cypress/e2e/`

---

## Git workflow

- Branch: `feature/testing-setup` from `develop`
- Commit: `feat: add Vitest unit tests and Cypress E2E tests`
