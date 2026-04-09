# Handoff — Automated testing (Vitest + Cypress)

Última atualização: **2026-04-08** — pausa pedida pelo usuário; outro agente continua a partir daqui. **Não editar** `.cursor/plans/automated_testing_setup_92a88141.plan.md` (plano de referência).

## Branch Git

- **Branch:** `feature/testing-setup`
- **Commit:** ainda **não** feito — alterações locais pendentes (inclui este `HANDOFF-testing.md` se quiserem versioná-lo).

## Estado da verificação (esta sessão)

- **`npm run test:ci`:** 46 testes Vitest passando.
- **`npm run test:e2e`:** **7/7** Cypress passando (`auto-save`, `character-wizard` ×3, `landing` ×3).
- **Atenção:** numa execução apareceu *“Port 3000 is in use … using 3001”* durante o spec `landing` — o `start-server-and-test` espera `http://localhost:3000`. Se E2E falhar de forma estranha, matar processos à escuta na 3000 e repetir.

## O que já está feito

### Vitest

- `vitest.config.ts`, `src/test/setup.ts`, scripts `test` / `test:ci`, testes colocados ao lado do código (`*.test.ts`).

### Cypress

- `cypress.config.ts` (inclui `allowCypressEnv: false` — remove o aviso Cypress 15 sobre `Cypress.env()` inseguro no browser).
- `cypress/tsconfig.json`, `cypress/support/e2e.ts` (ficheiro mínimo; comando `fillCharacterName` foi experimentado e **removido**).
- Specs: `landing.cy.ts`, `character-wizard.cy.ts`, `auto-save.cy.ts`.
- `test:e2e` — `start-server-and-test` (`dev` → `cypress run`).

### Aplicação (`character-form-wizard.tsx`)

- `data-testid`: `wizard-step-title`, `wizard-next`, `wizard-prev`.
- **`goNext`:** após `await trigger(...)`, volta a chamar **`getValues()`** antes de `validateStepValues`.
- **Hidratação Zustand:** em `onFinishHydration`, aplicação do draft ao formulário vai para **`setTimeout(..., 0)`**, para o React poder processar input antes de ler `isDirtyRef` e eventualmente fazer `reset` (reduz corrida com E2E).

### `basic-info-fields.tsx` — nome do personagem

- O campo **`characterName`** usa **`Controller`** do React Hook Form (componente controlado), com o mesmo `<input>` nativo, `data-testid="character-name-input"` e classes alinhadas aos outros campos.
- **Motivo:** com só `register` + Cypress `.type()`, o DOM às vezes mostrava valor mas **`getValues()`** no `goNext` ficava vazio; o `Controller` alinha estado RHF e DOM. O auto-save que só assertava após `reload` mascarava o problema.

### Isolamento E2E — `beforeEach` (`character-wizard.cy.ts` e `auto-save.cy.ts`)

- Padrão atual:

  1. `cy.visit("/")` — desmonta o wizard do teste anterior; o `flush` do `watch` corre no unmount.
  2. `cy.visit("/criar", { onBeforeLoad: limpar `localStorage` + `sessionStorage` })`.

- **Problema que isto resolve:** o `onBeforeLoad` limpava o storage, mas o **unmount do wizard anterior** podia fazer **`flushDraftToStore` depois** e **repovoar** o `localStorage` antes da hidratação do novo `/criar` — o próximo teste via rascunho antigo, `cy.type()` falhava ou a validação “sem nome” deixava de aparecer.

- **Nota histórica:** numa tentativa anterior, `visit("/")` + `visit("/criar")` foi marcado como “piorou tudo”; a diferença agora é o **contexto** (corrida com flush) e o **`Controller`** no nome.

### Ordem dos `it` em `character-wizard.cy.ts`

1. Não avançar sem nome.
2. Voltar/avançar mantendo o nome.
3. Fluxo completo até exportação.

Com o `beforeEach` acima, esta ordem volta a ser estável (não depende de reordenar só os testes).

## Pendente para o próximo agente

1. **Phase 3 do plano:** criar `.cursor/rules/testing.mdc` com `alwaysApply: true` (outline no plano: Vitest/Cypress, colocation, `data-testid`, evitar `cy.wait(ms)` arbitrário, etc.).
2. **Git:** `git add` apenas ficheiros da feature (não `.next/`, não screenshots de falha em `cypress/screenshots/`). Mensagem sugerida: `feat: add Vitest unit tests and Cypress E2E tests`. Depois perguntar merge em `develop` (`.cursor/rules/git-workflow.mdc`).
3. Opcional: apagar PNGs antigos em `cypress/screenshots/` se existirem.
4. Opcional: se `landing` voltar a subir servidor na 3001, investigar `start-server-and-test` / processos órfãos na 3000.

## Tentativas revertidas (não reaplicar sem reavaliar)

- `cy.visit("about:blank")` com `baseUrl` — vira URL sob `localhost:3000` → **404**.
- `afterEach` com `cy.visit("/")` + limpar storage — na exploração **piorou** interação com testes seguintes.
- Comando Cypress **`fillCharacterName`** (native `value` setter + `input`/`change`) — supérfluo após `Controller` + `visit("/")`; mantém-se `.clear().type()` nos specs.

## Comandos úteis

```bash
npm run test:ci      # unitários
npm run test:e2e     # dev + Cypress headless (todos os specs)
npx start-server-and-test dev http://localhost:3000 "npx cypress run --spec cypress/e2e/character-wizard.cy.ts"
npm run cypress:open
```
