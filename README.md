# Meu Background

**[Abrir no navegador (GitHub Pages)](https://ruan-diego.github.io/Meu-Background/)** · [Repositório no GitHub](https://github.com/Ruan-Diego/Meu-Background)

> Crie histórias completas e bonitas para seus personagens de RPG — passo a passo.

## O que é

**Meu Background** é um site gratuito e **sem cadastro**: você preenche um fluxo guiado e monta um **background de personagem** para RPG de mesa. Tudo roda no **seu navegador** — os dados ficam salvos localmente enquanto você edita — e no fim você **baixa** o resultado em **Markdown**, **texto** ou **PDF**, com **preview ao vivo** do documento.

O foco é **organizar** a informação para o **mestre** e para o **jogador**, e **guiar** quem está começando ou já tem experiência a montar uma história **completa** e ao mesmo tempo **concisa** — fácil de ler na mesa e de usar na campanha.

**Hoje** alguns campos e opções são específicos do mundo **Deorum**. **No futuro**, a ideia é ter **seleção de mundo/configuração de mesa** para que outras campanhas e sistemas possam usar o mesmo fluxo sem ficarem presos a um cenário só.

## O que já dá para fazer

- Formulário em etapas (informações básicas, origem e vínculos familiares, personalidade, objetivos, aparência/comportamento, notas livres e exportação)
- Preview do documento enquanto você digita
- Exportação em `.md`, `.txt` e `.pdf`
- Auto-save no navegador (localStorage)
- Tema claro e escuro e layout responsivo

## Para onde o projeto vai

O MVP cobre fluxo completo e exportação. Por cima disso, entram melhorias de **experiência** (por exemplo acessibilidade, outro idioma), **enriquecimento do apoio dentro do formulário** para quem escreve — sempre com conteúdo pensado pelo produto, **sem** geração automática de história por IA — e a evolução para **várias mesas/mundos**, como citado acima.

O **[roadmap](.specs/project/ROADMAP.md)** é um **rascunho de direções**: ideias do que *pode* ser feito ao longo do tempo, **não** um compromisso fixo nem garantia de ordem ou escopo — prioridades mudam conforme o uso e o feedback.

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
- [`.specs/project/ROADMAP.md`](.specs/project/ROADMAP.md) — ideias e marcos possíveis (planejamento, não promessa)  
- [`.specs/project/STATE.md`](.specs/project/STATE.md) — decisões, lições e estado atual (útil para quem contribui)  
- [`AGENTS.md`](AGENTS.md) — guia rápido para ferramentas de IA / contribuidores no repositório  

## Licença

MIT
