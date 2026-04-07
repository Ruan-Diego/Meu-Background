# Meu Background

> Crie histórias completas e bonitas para seus personagens de RPG — passo a passo.

**Meu Background** é uma aplicação web que guia jogadores de RPG na criação de backstories detalhadas e bem estruturadas para seus personagens. Preencha os campos, visualize o documento em tempo real e exporte como **Markdown**, **PDF** ou **Texto Puro**.

## Features (MVP)

- Formulário guiado em etapas (a ordem e as seções são a primeira camada de orientação; ajuda rica por campo vem depois, ver roadmap)
- Seções: Informações Básicas, Origem, Personalidade, Relacionamentos, Objetivos, Aparência, Notas Livres
- Preview ao vivo do documento gerado
- Exportação em `.md`, `.txt` e `.pdf`
- Auto-save no navegador (localStorage)
- Tema claro e escuro
- Responsivo (mobile-first)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Documentation

Detailed specs, architecture decisions, and roadmap live in the `.specs/` directory:

- [`.specs/project/PROJECT.md`](.specs/project/PROJECT.md) — Vision, goals, tech stack, scope
- [`.specs/project/ROADMAP.md`](.specs/project/ROADMAP.md) — Feature roadmap and milestones
- [`.specs/project/STATE.md`](.specs/project/STATE.md) — Decisions log, blockers, lessons learned

## License

MIT
