# M1-F13 — Export: PDF (.pdf)

## Problem Statement

Milestone 1’s definition of done requires three downloadable formats: Markdown, plain text, and PDF. Without PDF, players cannot obtain a single, shareable file that preserves layout and reads well for GMs who prefer attachments over raw Markdown or `.txt`. The product stack already lists **@react-pdf/renderer** for client-side, real PDF generation (not browser print).

## Goals

- [ ] Add a **Baixar PDF (.pdf)** control on the review step (Step 7), alongside existing export actions
- [ ] Generate the PDF from the same canonical **`CharacterDocument`** produced by `buildCharacterDocument()` (see `src/lib/character-form/document-sections.ts`) so content, section order, and empty-section rules match the live preview (M1-F10) and Markdown export (M1-F11)
- [ ] Apply **clear typographic styling** in the PDF (title, section headings, lists, body text) appropriate for a character backstory document — readable on screen and when printed, without requiring “print-optimized CSS” in the web app (still out of scope per PROJECT.md)
- [ ] Keep generation **entirely client-side**, consistent with the static / no-backend architecture

## Out of Scope

| Topic | Reason |
| --- | --- |
| Server-side PDF (API routes, headless Chrome, etc.) | Conflicts with client-only constraint |
| Web “Print to PDF” / `@media print` as the primary export | PROJECT.md excludes print-optimized CSS; PDF is its own deliverable via @react-pdf/renderer |
| Pixel-perfect match to the React/Tailwind preview | React-PDF uses its own layout model; parity is **semantic and structural**, not identical styling |
| Password protection, PDF/A, digital signatures | Not needed for MVP |
| Embedding user-uploaded images | Portrait upload is future (M5-F03) |
| Localization of PDF strings separate from app UI | English UI (M2-F02) can reuse the same document strings as the preview when i18n exists; no extra PDF-specific locale file required in M1 |

---

## User Stories

### P1: PDF download on the review step ⭐ MVP

**User Story**: As a player on “Revisão”, I want to download my backstory as a `.pdf` file so I can send a polished document to my GM.

**Why P1**: This is the feature’s primary surface; without it, M1 is incomplete.

**Acceptance Criteria**:

1. WHEN the user is on Step 7 (`review`) THEN the export area SHALL include a control labeled in Portuguese consistent with Markdown (e.g. **Baixar PDF (.pdf)**) that triggers PDF generation and download
2. WHEN the user activates the control THEN the app SHALL produce a binary PDF and initiate a browser download with a `.pdf` extension
3. WHEN `CharacterDocument.isEmpty` is true THEN the PDF control SHALL be disabled (same rule as the Markdown export button)
4. WHEN the download starts THEN the default filename SHALL use the same **slug rules** as Markdown for the basename (character name → ASCII slug, fallback `personagem`) with extension `.pdf` — either by reusing shared slug logic or by duplicating the documented behavior exactly

**Independent Test**: Fill a minimal valid document, open Step 7, click PDF download; open the file in a PDF viewer and confirm it opens and shows expected content.

---

### P1: Structural parity with canonical document model ⭐ MVP

**User Story**: As a player, I want the PDF to contain the same sections and omissions as the preview, so export does not surprise me with extra blank headings or missing blocks.

**Why P1**: M1-F10 explicitly defines canonical structure; exports must not fork that logic.

**Acceptance Criteria**:

1. WHEN the PDF is generated THEN its section order SHALL follow wizard order: Basic Info → Origin & Background → Personality & Traits → Goals & Motivations → Appearance & Description → Free Notes (as represented in `CharacterDocument.sections`)
2. WHEN a section has no content in the canonical model THEN the PDF SHALL omit that section (no empty section titles)
3. WHEN the document is empty per `isEmpty` THEN no PDF download SHALL occur (control disabled; no empty file)
4. WHEN the header has no character name THEN the PDF title treatment SHALL still reflect the “unnamed” case in a readable way (aligned with preview semantics, e.g. a clear placeholder title)
5. WHEN blocks are `entries`, `tags`, `text`, or `note` types THEN the PDF SHALL render them in a way that preserves hierarchy: labeled groups, bullet lists for entries where appropriate, distinct free-note headings

**Independent Test**: Compare preview and PDF for the same form state (filled and partially filled); section presence and ordering should match.

---

### P1: Integration with Next.js App Router and @react-pdf/renderer ⭐ MVP

**User Story**: As a developer, I want PDF code to load safely in the app without breaking SSR or the production build.

**Why P1**: @react-pdf/renderer is browser-oriented; Next 15+ App Router needs a predictable loading pattern.

**Acceptance Criteria**:

1. WHEN the PDF is generated THEN the implementation SHALL avoid executing React-PDF in a server context where it is unsupported (e.g. use a client component boundary and, if required, dynamic import so the library loads only in the browser)
2. WHEN `next build` runs THEN the application SHALL compile without errors attributable to React-PDF imports
3. WHEN generation fails (runtime error) THEN the user SHALL get a clear, non-technical error feedback (e.g. toast or inline message) and the app SHALL not crash; exact UX can match other export patterns if they exist

**Independent Test**: Run production build; smoke-test PDF button on `/criar` review step.

---

### P2: Readable typography and pagination ⭐ Quality

**User Story**: As a reader, I want long backstories to wrap and break across pages cleanly so the PDF is usable for long-form text.

**Why P2**: Backstories can be lengthy; poor breaks undermine “publication-quality” goal from PROJECT.md.

**Acceptance Criteria**:

1. WHEN body text or notes contain long paragraphs THEN text SHALL wrap within page margins
2. WHEN content exceeds one page THEN the PDF SHALL continue on additional pages (no clipped content)
3. WHEN practical, section headings SHOULD not sit orphaned at the bottom of a page without at least some following content (soft goal — implement where React-PDF allows without hacks)

**Independent Test**: Fill appearance and free notes with long text; generate PDF and scroll through all pages.

---

### P2: Portuguese text rendering ⭐ Quality

**User Story**: As a pt-BR user, I want accents and cedilla (á, ã, ç, etc.) to render correctly in the PDF.

**Why P2**: Primary audience is Brazilian RPG players.

**Acceptance Criteria**:

1. WHEN form fields contain typical Portuguese diacritics THEN those characters SHALL appear correctly in the PDF (register fonts with @react-pdf/renderer if default fonts are insufficient)
2. WHEN users type emoji or rare Unicode THEN the PDF SHALL not crash; replacement or omission is acceptable if documented, but common Latin-1 / Latin Extended must work

**Independent Test**: Export a character with strings containing `São Paulo`, `ação`, `coração`, etc.

---

## Edge Cases

- WHEN the user triggers PDF generation twice in quick succession THEN each download SHALL still complete or fail independently without leaving the UI stuck in a permanent loading state
- WHEN `characterName` is only whitespace THEN the filename SHALL fall back the same way as Markdown (`personagem` slug)
- WHEN a single field contains very long unbroken strings THEN the PDF SHOULD still avoid horizontal overflow (wrap or break where possible)
- WHEN React-PDF bundle size is significant THEN code-splitting (dynamic import) SHOULD keep initial `/criar` load reasonable — exact budget is not fixed in M1, but avoid importing React-PDF on unrelated routes

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| PDF-01 | P1: PDF download on review step | Execute | Pending |
| PDF-02 | P1: Structural parity with `CharacterDocument` | Execute | Pending |
| PDF-03 | P1: Next.js + React-PDF integration | Execute | Pending |
| PDF-04 | P2: Typography and pagination | Execute | Pending |
| PDF-05 | P2: Portuguese / Unicode rendering | Execute | Pending |

**Coverage:** 5 total, 0 mapped to tasks, 5 unmapped ⚠️ (add `design.md` / `tasks.md` when breaking down implementation)

---

## Success Criteria

- [ ] Review step offers PDF download alongside other exports
- [ ] PDF content matches the canonical document model (sections, omissions, block types)
- [ ] Filename follows Markdown slug rules with `.pdf` extension
- [ ] Empty document cannot be exported as PDF
- [ ] Production build passes; PDF works in a current Chromium-based browser
- [ ] Portuguese accents render correctly in the PDF body

---

## Notes

- **Single source of truth:** Implement PDF layout by mapping `CharacterDocument` → React-PDF primitives (`Document`, `Page`, `View`, `Text`, `StyleSheet`). Do not rebuild section logic from raw `CharacterFormValues` in the PDF module.
- **Shared utilities:** Consider extracting `slugifyBasename` (currently in `document-markdown.ts`) to a small shared module so Markdown, TXT (M1-F12), and PDF filenames stay aligned.
- **Testing:** Prefer at least one automated test that asserts mapping from a small fixture `CharacterDocument` to a stable fragment of output, or a smoke test that `pdf()` / render completes without throw; full visual PDF regression is optional for M1.
- **Dependency:** `@react-pdf/renderer` is already declared in `package.json` (^4.4.0) per PROJECT.md.
