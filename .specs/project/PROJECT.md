# Meu Background

**Vision:** A guided, step-by-step web application that helps RPG players craft rich, complete character backstories — and exports them as beautifully formatted documents ready to share with their Game Master.

**For:** Tabletop RPG players and Game Masters (D&D, Pathfinder, Call of Cthulhu, and system-agnostic).

**Solves:** Creating a detailed, well-structured character background is time-consuming and often results in incomplete or disorganized stories. Meu Background guides the player through each narrative pillar — origin (including family ties), personality, motivations — ensuring nothing is missed, and outputs a polished document in standard formats.

**Guidance (core product value):** The app’s job is not only to collect fields, but to **help the player think and write** a coherent story. The step-by-step flow is the first layer of that guidance. **Richer in-form help** (examples, prompts, expandable tips, section intros) is intentionally light in v1 but is **one of the highest-priority directions** after the MVP — all editorial, human-written content in the UI, **not** automated or AI-generated suggestions.

## Product requirements (facilitating the background)

- **Reduce blank-page anxiety:** The experience should not feel like “many empty text areas and think alone”; where the MVP is still open-ended, we document the gap and schedule richer structure and coaching (see roadmap Milestone 3, and **M3-F07** for the Appearance step).
- **Consistent support across steps:** Interactive patterns that already help elsewhere (chips, addable rows, optional revealed detail) should extend to narrative-heavy free-text steps over time — not only labels and placeholders.
- **Honest MVP boundaries:** Steps that are temporarily textarea-heavy carry an in-app note so expectations stay aligned with the long-term goal: **facilitate creation**, not only store text.

## Goals

- **Complete backstories:** Guide players through all essential narrative elements so no section is left blank or underdeveloped (structure and flow in v1; deeper coaching in later milestones).
- **Narrative coaching over time:** Iteratively improve how the app teaches and nudges (placeholders, tooltips, examples, checklists) — **without** AI-powered suggestion features; see roadmap Milestone 3.
- **Beautiful exports:** Generate publication-quality Markdown, plain text, and PDF documents with consistent formatting.
- **Zero friction:** No accounts, no servers, no setup — open the site and start creating.
- **Accessible to all players:** Responsive design that works on desktop, tablet, and mobile. Support for dark and light themes.

## Tech Stack

**Core:**

- Framework: Next.js 15 (App Router, React 19)
- Language: TypeScript 5
- Styling: Tailwind CSS 4 + shadcn/ui
- Icons: Lucide React

**Key dependencies:**

- React Hook Form + Zod — multi-step form management with schema validation
- Zustand — lightweight global state for character data across steps
- @react-pdf/renderer — client-side PDF generation
- Framer Motion — step transitions and micro-interactions
- Vitest + React Testing Library — unit and component testing
- Playwright — E2E testing

**Architecture decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Static export (SSG) | No backend needed; deploy anywhere (Vercel, GitHub Pages, Netlify) |
| State management | Zustand | Minimal boilerplate, perfect for a single-page multi-step form; persists to localStorage |
| Form library | React Hook Form + Zod | Best DX for complex multi-step forms; Zod provides runtime validation and type inference |
| PDF generation | @react-pdf/renderer | Runs entirely client-side; produces real PDF (not print-to-PDF hacks) |
| Component library | shadcn/ui | Copy-paste ownership, Tailwind-native, accessible by default (Radix primitives) |
| Testing | Vitest + RTL + Playwright | Fast unit tests (Vitest), idiomatic component tests (RTL), real browser E2E (Playwright) |
| i18n | pt-BR first, English second | Primary audience is Brazilian RPG community; structure for easy translation later |

## Scope

**v1 (MVP) includes:**

- Multi-step guided form with progress indicator (steps themselves are the primary guidance; **no** rich per-field suggestions, examples, or coaching copy beyond basic labels — that comes in post-MVP guidance work)
- Sections: Basic Info, Origin & Background (includes family / relationship ties), Personality & Traits, Goals & Motivations, Appearance & Description, Free Notes
- Live preview of the generated document
- Export as Markdown (.md)
- Export as Plain Text (.txt)
- Export as PDF (.pdf)
- Auto-save to localStorage (no data loss on refresh)
- Dark/Light theme toggle
- Fully responsive (mobile-first)
- pt-BR as default language

**Explicitly out of scope (v1):**

- User accounts / authentication
- Server-side storage or database
- AI-powered or ML-generated text suggestions (not planned for this product at any stage)
- System-specific templates (D&D 5e sheets, etc.)
- Collaborative editing
- Image upload for character portraits
- Print-optimized CSS

## Constraints

- Timeline: No hard deadline
- Technical: Client-side only — no backend, no API keys, no costs
- Resources: Solo developer
