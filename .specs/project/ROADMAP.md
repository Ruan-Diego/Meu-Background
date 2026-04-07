# Roadmap — Meu Background

## Milestone 1: Foundation (MVP Core)

> Get the app running with the guided form and basic export.


| ID     | Feature                    | Description                                                                | Size |
| ------ | -------------------------- | -------------------------------------------------------------------------- | ---- |
| M1-F01 | Project scaffolding        | Next.js 15 + TypeScript + Tailwind + shadcn/ui + Zustand + RHF setup       | S    |
| M1-F02 | Design system & layout     | App shell, theme toggle (dark/light), responsive layout, typography tokens | M    |
| M1-F03 | Multi-step form engine     | Step navigation, progress bar, validation per step, keyboard nav           | L    |
| M1-F04 | Step: Basic Info           | Character name, player name, RPG system, campaign name, level/tier         | S    |
| M1-F05 | Step: Origin & Background  | Birthplace, family & relationship ties, social class, formative events, occupation | M    |
| M1-F06 | Step: Personality & Traits | Temperament, values, flaws, fears, habits, quirks                          | M    |
| M1-F07 | Step: Goals & Motivations  | Short-term goals, long-term ambitions, secrets, moral dilemmas             | M    |
| M1-F08 | Step: Appearance           | Physical description, distinctive marks, clothing style, mannerisms        | S    |
| M1-F09 | Step: Free Notes           | Open text area for anything that doesn't fit above                         | S    |
| M1-F10 | Document preview           | Live rendered preview of the full character document                       | M    |
| M1-F11 | Export: Markdown (.md)     | Generate and download a well-formatted .md file                            | M    |
| M1-F12 | Export: Plain Text (.txt)  | Generate and download a clean .txt file                                    | S    |
| M1-F13 | Export: PDF (.pdf)         | Generate and download a styled PDF via @react-pdf/renderer                 | L    |
| M1-F14 | Auto-save (localStorage)   | Persist form state to localStorage; restore on revisit                     | S    |


**Definition of Done for M1:** A user can open the site, fill out all steps, preview the document, and download it in all three formats — with data surviving a page refresh.

**MVP guidance note:** v1 ships with **structural** guidance (steps, order, required flow) only. Deliberately **no** rich per-field coaching, example text, or expandable help panels yet — that is the focus of **Milestone 3**.

---

## Milestone 2: Polish & UX

> Motion, accessibility, i18n, SEO. **No** in-form coaching or suggestive placeholders here — that is entirely Milestone 3.


| ID     | Feature                | Description                                            | Size |
| ------ | ---------------------- | ------------------------------------------------------ | ---- |
| M2-F01 | Step transitions       | Framer Motion animations between form steps            | S    |
| M2-F02 | i18n: English support  | Add English translation alongside pt-BR                | M    |
| M2-F03 | Character summary card | Compact visual card with key info (shareable as image) | M    |
| M2-F04 | Accessibility audit    | WCAG 2.1 AA compliance pass, screen reader testing     | M    |
| M2-F05 | SEO & meta tags        | Open Graph, Twitter cards, structured data             | S    |


---

## Milestone 3: Narrative guidance & in-form help (high priority)

> **Most important post-MVP product work:** deepen how the app helps the player *think* and *write* — all through curated UI copy, examples, and structure. **No AI.**


| ID     | Feature                          | Description                                                                                          | Size |
| ------ | -------------------------------- | ---------------------------------------------------------------------------------------------------- | ---- |
| M3-F01 | Labels, placeholders & microcopy | Neutral labels in MVP; here, intentional placeholders and short non-prescriptive hints where helpful | M    |
| M3-F02 | Step intros & intent             | Each step explains *why* it matters and what the GM/player gain from it                              | M    |
| M3-F03 | Expandable help per section      | “Como preencher” / tips panels per step or field group (editorial content)                           | L    |
| M3-F04 | Examples & writing prompts       | Optional example snippets and question prompts per field (static, hand-authored)                     | L    |
| M3-F05 | Completeness & quality checklist | Pre-export checklist: sections empty, tone, consistency nudges (rule-based, not generative)          | M    |
| M3-F06 | Optional GM tips block           | Short GM-facing notes in export or sidebar (curated copy)                                            | S    |


**Definition of Done for M3:** A new player can complete a backstory with materially more support than v1 — without any automated text generation.

---

## Milestone 4: Multi-Character & Templates

> Support multiple characters and RPG-system-specific templates.


| ID     | Feature            | Description                                                                   | Size |
| ------ | ------------------ | ----------------------------------------------------------------------------- | ---- |
| M4-F01 | Character list     | Manage multiple characters in localStorage                                    | M    |
| M4-F02 | Import/export JSON | Save/load full character data as JSON file                                    | S    |
| M4-F03 | System templates   | Pre-configured field sets for D&D 5e, Pathfinder 2e, Call of Cthulhu, generic | L    |
| M4-F04 | Template editor    | Let users customize which fields appear                                       | L    |


---

## Milestone 5: Social & sharing (Future)

> Share characters with your party — still client-first where possible.


| ID     | Feature                   | Description                                                              | Size |
| ------ | ------------------------- | ------------------------------------------------------------------------ | ---- |
| M5-F01 | Shareable links           | Encode character data in URL for easy sharing                            | M    |
| M5-F02 | Character gallery         | Public gallery of shared characters (requires backend)                   | L    |
| M5-F03 | Character portrait upload | Optional image upload for character portrait (user-provided assets only) | M    |


---

## Sizing Legend


| Size | Effort   | Typical scope                                                                                    |
| ---- | -------- | ------------------------------------------------------------------------------------------------ |
| S    | < 1 day  | Single component, simple logic. Quick mode — describe → implement → verify → commit              |
| M    | 1–3 days | Multiple components, moderate logic. Specify → Execute (design and tasks inline)                 |
| L    | 3–5 days | Cross-cutting, complex logic or integration. Full pipeline with formal design and task breakdown |


