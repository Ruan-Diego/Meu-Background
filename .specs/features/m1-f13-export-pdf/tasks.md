# M1-F13 — Export PDF: Task Breakdown

Tasks are ordered by dependency. Each commit should be atomic where practical; merge when the feature branch is complete per project git workflow.

## Task index → Requirements

| Task | PDF-01 | PDF-02 | PDF-03 | PDF-04 | PDF-05 |
| --- | --- | --- | --- | --- | --- |
| T1 Shared filename helper | ● | | | | |
| T2 CharacterDocumentPdf component | | ● | | ● | ● |
| T3 Client generator + dynamic import | | | ● | | |
| T4 PdfExportButton + wizard wiring | ● | | ● | | |
| T5 Error/loading/double-click UX | ● | | ● | | |
| T6 Tests + build smoke | ● | ● | ● | ● | ● |

---

### T1 — Extract shared document basename / filename helpers

**Goal:** Single implementation of slug rules for export filenames (spec: reuse or duplicate exactly—prefer reuse).

**Steps:**

1. Add `src/lib/character-form/document-filename.ts` exporting:
   - `slugifyCharacterDocumentBasename(doc: CharacterDocument): string` **or** `slugifyBasenameFromName(name: string): string` matching current logic in `document-markdown.ts` / `document-plain-text.ts`.
   - `characterDocumentMarkdownFilename`, `characterDocumentPlainTextFilename`, `characterDocumentPdfFilename` (or compose from basename + extension).
2. Update `document-markdown.ts` and `document-plain-text.ts` to import shared helpers; remove duplicated private `slugifyBasename` implementations.

**Verification:**

- [ ] Unit behavior unchanged: empty/whitespace name → `personagem`; accented names → ASCII slug; extension `.md` / `.txt` / `.pdf` correct for each helper.
- [ ] No regression in existing export filenames (spot-check same inputs as before).

**Maps to:** PDF-01 (filename parity).

---

### T2 — Implement `CharacterDocumentPdf` (React-PDF tree)

**Goal:** Map `CharacterDocument` → styled PDF document (no form values).

**Steps:**

1. Add `src/lib/character-form/document-pdf.tsx` with:
   - `StyleSheet` for title, section headings, labels, body, lists, notes.
   - Component accepting `document: CharacterDocument` (prop name avoids clashing with React-PDF `Document`).
   - Render header: name or “Sem nome” treatment; player line; meta line—aligned with preview semantics.
   - Iterate `doc.sections` in order; omit empty sections implicitly (sections only exist if builder included them).
   - Render blocks: `text`, `tags`, `entries`, `note` with correct hierarchy (bullets for entries/tags as appropriate).
2. Register a Unicode font (e.g. Noto Sans) and apply to user-facing text (PDF-05).
3. Set page size, margins; ensure body text wraps and flows to multiple pages (PDF-04).
4. Optionally group section title + first content in `View` with `minPresenceAhead` for orphan reduction (PDF-04 soft).

**Verification:**

- [ ] Manual: filled form → PDF shows same sections/order as preview for a few scenarios (minimal, partial, long text).
- [ ] Portuguese sample strings render correctly in body.

**Maps to:** PDF-02, PDF-04, PDF-05.

---

### T3 — Add client-only PDF generation helper (dynamic import)

**Goal:** Generate `Blob` without SSR issues and with code-splitting.

**Steps:**

1. Add `src/lib/character-form/generate-character-pdf.ts` (or colocate in same dynamic boundary as T2):
   - `export async function generateCharacterPdfBlob(doc: CharacterDocument): Promise<Blob>`.
   - `const { pdf } = await import('@react-pdf/renderer')`; return `pdf(<CharacterDocumentPdf ... />).toBlob()`.
2. Ensure no server entry imports this module statically from RSC-only files.

**Verification:**

- [ ] `next build` succeeds.
- [ ] No React-PDF import errors in build output.

**Maps to:** PDF-03.

---

### T4 — `PdfExportButton` and review step integration

**Goal:** User-visible control consistent with other exports.

**Steps:**

1. Add `src/components/character-form/pdf-export-button.tsx` (`"use client"`):
   - `useFormContext`, `buildCharacterDocument(getValues())`, disabled if `doc.isEmpty`.
   - Label: **Baixar PDF (.pdf)** (Portuguese, parallel to Markdown button).
   - On click: `generateCharacterPdfBlob(doc)` → trigger download with `characterDocumentPdfFilename(doc)` (from T1).
2. Wire into `character-form-wizard.tsx` review block next to Markdown and plain text.

**Verification:**

- [ ] Step 7 shows three export buttons; PDF downloads `.pdf` with correct basename.
- [ ] Empty form: PDF disabled like Markdown.

**Maps to:** PDF-01, PDF-03.

---

### T5 — Loading, errors, rapid double-click

**Goal:** Robust UX per spec edge cases.

**Steps:**

1. Add loading state while blob is generating; prevent overlapping generations (ignore or disable until complete).
2. Wrap generation + download in `try/catch`; show user-friendly message (toast or inline) on failure; no uncaught errors.

**Verification:**

- [ ] Double-click / fast repeat: UI returns to idle; second download can succeed after first finishes.
- [ ] Simulated failure (e.g. dev-only throw) shows feedback without crashing the wizard.

**Maps to:** PDF-01, PDF-03.

---

### T6 — Automated test(s) and documentation touch-up

**Goal:** Regression safety for mapping and pipeline.

**Steps:**

1. Add Vitest test(s): either mock dynamic import and assert `CharacterDocumentPdf` renders structure, or test `generateCharacterPdfBlob` with a small fixture document completes without throw (per project testing style).
2. Update `spec.md` requirement table statuses to **Designed** / link tasks when starting execution.

**Verification:**

- [ ] `pnpm test` (or project equivalent) passes.
- [ ] README unchanged unless team requires export list update (optional).

**Maps to:** All IDs (light coverage).

---

## Dependency graph

```
T1 ─────────────────────────────┐
                                 ├──► T4 ──► T5
T2 ──► T3 ─────────────────────┘
         │
         └──► T6 (after T4/T5 for E2E/smoke)
```

**Suggested commit sequence:** T1 → T2 → T3 → T4 → T5 → T6 (T2+T3 can be one commit if preferred, but keep filename refactor separate for cleaner review).
