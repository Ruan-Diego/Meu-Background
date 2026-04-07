# State — Meu Background

> Persistent memory across sessions. Decisions, blockers, lessons, and deferred ideas.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | No standalone “Step: Relationships” in the wizard or roadmap; former M1-F08–F15 renumbered to M1-F07–F14 | Family and relationship ties live in step 2 (Origin & Background) via `relatives[]`; the old empty Relationships step duplicated that intent |
| 2026-04-07 | Theme switching uses `next-themes` with class-based dark mode | Keeps App Router theming simple, avoids custom hydration work, and matches the token strategy in `globals.css` |
| 2026-04-06 | Next.js 15 with static export | No backend needed; deploy to any static host; React 19 features available |
| 2026-04-06 | Zustand over Context API | Simpler API for cross-step state; built-in localStorage middleware |
| 2026-04-06 | React Hook Form + Zod | Best multi-step form DX; Zod gives runtime + compile-time safety |
| 2026-04-06 | @react-pdf/renderer for PDF | True PDF generation client-side; no server dependency |
| 2026-04-06 | shadcn/ui over Chakra/MUI | Tailwind-native, copy-paste ownership, accessible Radix primitives |
| 2026-04-06 | pt-BR first language | Primary audience is Brazilian RPG community |
| 2026-04-06 | No AI in product plans | Guidance is editorial/in-app only; narrative coaching is a major roadmap theme (Milestone 3), not machine-generated suggestions |

## Blockers

_None currently._

## Lessons Learned

_None yet — project just initialized._

## Deferred Ideas

- Collaborative party backstory editing
- Print-optimized CSS as alternative to PDF
- Offline PWA support

**Not planned:** AI-powered or ML-generated backstory suggestions.

## TODOs

- [x] Build design system & layout (M1-F02)
- [x] Scaffold Next.js project (M1-F01)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Define character data schema (Zod)

## Preferences

- Lightweight tasks (validation, state updates) work well with faster/cheaper models.
