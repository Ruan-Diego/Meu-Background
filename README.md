# Meu Background

**[Abrir no navegador (GitHub Pages)](https://ruan-diego.github.io/Meu-Background/)** · [Repositório no GitHub](https://github.com/Ruan-Diego/Meu-Background)

> Crie histórias completas e bonitas para seus personagens de RPG — passo a passo.

## O que é

**Meu Background** é um site gratuito e **sem cadastro**: você preenche um fluxo guiado e monta um **background de personagem** para RPG de mesa (D&D, Pathfinder, sistemas genéricos, etc.). Tudo roda no **seu navegador** — os dados ficam salvos localmente enquanto você edita — e no fim você **baixa** o resultado em **Markdown**, **texto** ou **PDF**, com **preview ao vivo** do documento.

Ideal para jogadores que querem uma história organizada e para mestres que recebem um texto pronto para a mesa.

## O que já dá para fazer

- Formulário em etapas (informações básicas, origem e vínculos familiares, personalidade, objetivos, aparência/comportamento, notas livres e exportação)
- Preview do documento enquanto você digita
- Exportação em `.md`, `.txt` e `.pdf`
- Auto-save no navegador (localStorage)
- Tema claro e escuro e layout responsivo

## Para onde o projeto vai

O MVP cobre fluxo completo e exportação. As próximas ondas de trabalho tendem a **polir experiência** (animações, acessibilidade, talvez outro idioma) e, mais adiante, **enriquecer o apoio dentro do formulário** para quem está escrevendo — sempre com conteúdo pensado pelo produto, **sem** geração automática de história por IA. O detalhamento oficial está no **[roadmap](.specs/project/ROADMAP.md)**.

## Tech stack

| Camada | Tecnologia |
|--------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router, React 19) |
| Linguagem | TypeScript 5 |
| Estilo | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Formulários | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Estado | [Zustand](https://zustand-demo.pmnd.rs/) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/) |
| Animação | [Framer Motion](https://www.framer.com/motion/) |
| Testes | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [Cypress](https://www.cypress.io/) (E2E) |

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
# Testes unitários (uma execução, estilo CI)
npm run test:ci

# E2E (sobe o dev server e roda o Cypress)
npm run test:e2e

# Build de produção (export estático em out/)
npm run build
```

## Documentação do projeto

- [`.specs/project/PROJECT.md`](.specs/project/PROJECT.md) — visão, objetivos e escopo do produto  
- [`.specs/project/ROADMAP.md`](.specs/project/ROADMAP.md) — marcos, features e ideias futuras  
- [`.specs/project/STATE.md`](.specs/project/STATE.md) — decisões, lições e estado atual (útil para quem contribui)  
- [`AGENTS.md`](AGENTS.md) — guia rápido para ferramentas de IA / contribuidores no repositório  

## Licença

MIT
