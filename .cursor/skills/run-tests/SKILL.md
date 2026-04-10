---
name: run-tests
description: >-
  Run unit tests (Vitest) and E2E tests (Cypress) for the project, report
  results, and fix failures. Use when the user says "run tests", "check tests",
  "test suite", "verify tests", or before marking a feature as complete.
---

# Run Tests

## Workflow

Run both suites **in order** — unit tests are fast and catch logic errors first;
E2E tests need a dev server and take longer.

### Step 1 — Unit tests

```bash
npm run test:ci
```

- **Expected**: all tests pass (`Tests: N passed`).
- On failure: read the failing test output, locate the source file, fix the
  regression, and re-run before moving on.

### Step 2 — E2E tests

```bash
npm run test:e2e
```

This starts the Next.js dev server on port 3000 and runs Cypress headless.

- **Expected**: all specs pass (`All specs passed!`).
- On failure: read the spec output and any screenshot paths printed by Cypress.
  Common causes:
  - **Port 3000 already in use** — kill the orphan process and retry.
  - **Hydration race** — ensure `cy.get("form[data-ready]")` is awaited before
    interacting with forms that use Zustand persist.
  - **Stale localStorage** — the `beforeEach` should visit `"/"` first, then
    `"/criar"` with `onBeforeLoad` clearing storage.

### Step 3 — Report

After both suites finish, summarise:

```
Unit:  <passed>/<total> passed
E2E:   <passed>/<total> passed   (<spec breakdown>)
```

If everything passes, tell the user tests are green.
If anything fails, list the failing tests with a short root-cause note and
propose a fix.

## Running a single Cypress spec

```bash
npx start-server-and-test dev http://localhost:3000 "npx cypress run --spec cypress/e2e/<spec>.cy.ts"
```

## Interactive Cypress

```bash
npm run cypress:open
```
