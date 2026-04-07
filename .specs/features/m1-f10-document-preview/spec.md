# M1-F10 — Document Preview (Step 7: Review)

## Problem Statement

After filling out six form steps, the user has no way to see how their backstory reads as a single, cohesive document. They would need to export first just to review their own writing. A dedicated **review step** at the end of the wizard closes that feedback loop — the user finishes filling, moves to Step 7, and sees the full rendered document before deciding to export.

## Goals

- [ ] Add a 7th wizard step ("Revisão") that renders the complete character document in read-only form
- [ ] Establish the canonical document structure (section order, heading hierarchy, empty-section handling) that the three export features (M1-F11, M1-F12, M1-F13) will reuse
- [ ] Keep the preview useful even when sections are incomplete — omit empty sections, don't show blank headings

## Out of Scope

| Feature | Reason |
| --- | --- |
| Export buttons (Markdown, TXT, PDF) | Separate features M1-F11 / M1-F12 / M1-F13 |
| Right-hand suggestion panel | Separate roadmap item (rule-based guidance); the current right-panel placeholder will be replaced by that feature |
| Rich text editing inside the preview | Preview is read-only; editing happens in the form steps |
| Print-optimized CSS | Explicitly out of scope for v1 (PROJECT.md) |
| Narrative coaching copy or section intros | Milestone 3 concern |
| Collapsible / expandable sections in the preview | Nice-to-have, not MVP |

---

## User Stories

### P1: Review step in the wizard ⭐ MVP

**User Story**: As a player, I want a final "Revisão" step after Free Notes so that I can review the full rendered document before exporting.

**Why P1**: Without this step, the preview has no home in the UI.

**Acceptance Criteria**:

1. WHEN the wizard is rendered THEN Step 7 ("Revisão") SHALL appear after Step 6 ("Notas livres") in the step rail, progress bar, and keyboard navigation
2. WHEN the user advances past Step 6 THEN the wizard SHALL navigate to Step 7 showing the document preview (no form fields)
3. WHEN the user is on Step 7 THEN the "Anterior" button SHALL navigate back to Step 6
4. WHEN the user is on Step 7 THEN there SHALL be no "Próxima" button (it is the last step)
5. WHEN the user navigates to Step 7 THEN the wizard SHALL persist the draft (same as other step transitions)

**Independent Test**: Navigate through all 6 form steps, advance to Step 7; confirm the step rail shows "Revisão" as active and the content area shows the rendered document.

---

### P1: Full document rendering ⭐ MVP

**User Story**: As a player on the review step, I want to see my entire backstory rendered as a formatted document so that I can read it as a continuous narrative.

**Why P1**: This is the core value — seeing the document as a whole.

**Acceptance Criteria**:

1. WHEN the preview is rendered THEN it SHALL display sections in wizard order: Basic Info → Origin & Background → Personality & Traits → Goals & Motivations → Appearance & Description → Free Notes
2. WHEN a section has no filled fields THEN the preview SHALL omit that section entirely (no empty headings)
3. WHEN only the character name is filled THEN the preview SHALL show the document title and nothing else
4. WHEN all form fields are empty THEN the preview SHALL show a friendly empty state (e.g. "Preencha o formulário para ver o preview do documento")
5. WHEN array fields contain multiple entries (e.g. relatives, fears, goals) THEN the preview SHALL render each entry as a distinct item

**Independent Test**: Fill fields across multiple steps, navigate to Step 7; verify each filled section appears and empty sections are hidden.

---

### P1: Document title and header ⭐ MVP

**User Story**: As a player, I want the document to open with my character's name as the title so that the preview reads like a real document.

**Why P1**: The title anchors the document; without it, the preview is a loose collection of fields.

**Acceptance Criteria**:

1. WHEN `characterName` is non-empty THEN the preview header SHALL display it as the document title
2. WHEN `playerName` is non-empty THEN the preview header SHALL show it as a byline below the title
3. WHEN `characterName` is empty THEN the preview SHALL show a muted placeholder title (e.g. "Sem nome")
4. WHEN header metadata fields are filled (age, race, class, occupation) THEN the preview header SHALL display them in a compact summary line

**Independent Test**: Type a character name and player name in Step 1, navigate to Step 7; confirm the title and byline appear.

---

### P1: Section rendering — all form steps ⭐ MVP

**User Story**: As a player, I want every section rendered with clear headings and structured content so that the preview reads like a formatted backstory document.

**Why P1**: Partial rendering would mislead the user about what the export will contain.

**Acceptance Criteria**:

1. WHEN origin fields are filled THEN the preview SHALL render birthplace (country / region / city), relatives as a list, shaping events as a list, and occupation
2. WHEN personality fields are filled THEN the preview SHALL render temperament tags, value tags, flaws, fears (with level), habits, and quirks — each as a labeled group
3. WHEN goals fields are filled THEN the preview SHALL render short-term goals and life goals as distinct groups, each showing the label and description
4. WHEN appearance fields are filled THEN the preview SHALL render each sub-field (height, hidden marks, first impression, voice, mannerisms) under a common heading
5. WHEN free notes exist THEN the preview SHALL render each note with its topic as a sub-heading and description as body text

**Independent Test**: Fill at least one field per step; navigate to Step 7; confirm all sections render under correct headings.

---

### P2: Navigate back to edit from preview

**User Story**: As a player reviewing my document, I want to jump directly to a specific form step to fix something I noticed, so that I don't have to click "Anterior" six times.

**Why P2**: Quality-of-life improvement; the step rail already supports clicking any step.

**Acceptance Criteria**:

1. WHEN the user is on Step 7 THEN the step rail SHALL remain interactive — clicking any step navigates to it
2. WHEN the user clicks a step from the preview THEN the wizard SHALL navigate to that step and persist the current draft

**Independent Test**: On Step 7, click Step 3 in the step rail; confirm navigation works and returns to personality fields.

---

## Edge Cases

- WHEN only array fields are present but all entries have blank strings THEN the preview SHALL treat them as empty and omit the section
- WHEN the character name exceeds 100 characters THEN the preview title SHALL wrap gracefully (no overflow)
- WHEN a relative entry has only `kinship` filled but `name` and `background` are blank THEN the preview SHALL still render that entry (partial data is valid)
- WHEN the user navigates directly to Step 7 via the step rail (skipping steps) THEN the preview SHALL render whatever data exists — no validation gate blocks access to the review step

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| PREV-01 | P1: Review step in wizard | Design | Pending |
| PREV-02 | P1: Full document rendering | Design | Pending |
| PREV-03 | P1: Document title and header | Design | Pending |
| PREV-04 | P1: Section rendering | Design | Pending |
| PREV-05 | P2: Navigate back to edit | Design | Pending |

**Coverage:** 5 total, 0 mapped to tasks, 5 unmapped ⚠️

---

## Success Criteria

- [ ] Step 7 ("Revisão") appears in the wizard after "Notas livres" and works with all navigation (rail, buttons, keyboard shortcuts)
- [ ] The preview renders only sections that have content — no empty headings or placeholder blocks
- [ ] The rendered document structure is the single source of truth that M1-F11/F12/F13 exports will consume
- [ ] The user can navigate back to any form step from the review to make corrections

---

## Notes

- **Right-hand panel:** The current placeholder preview card on `/criar` will be replaced by the **suggestion panel** (separate roadmap item, rule-based incoherence warnings and ideas). That feature owns the panel's redesign.
- **Canonical document structure:** The rendering logic built here (section ordering, empty-field filtering, heading hierarchy) should be extracted into a shared module so exports can reuse it without duplicating layout decisions.
