# Handoff — M2-F02 i18n (English support)

**Data:** 2026-04-10 (atualizado)  
**Branch:** `feature/m2-f02-i18n-english-support` (não mergeada)  
**Objetivo:** Implementar `spec.md` / `design.md` / `tasks.md` desta pasta.

---

## O que já está feito

### Mensagens e infraestrutura i18n

- **`messages/pt-BR.json`** e **`messages/en.json`** — árvore de chaves alinhada (namespaces: `meta`, `common`, `shell`, `localeSwitcher`, `home`, `criarPage`, `steps`, `formProgress`, `stepRail`, `wizard`, `preview`, `fields`, `validation`, `export`, `document`, `options`, `filename`). Inclui **`shell.mainNavAria`** (para nav acessível no header).
- **`src/lib/i18n/config.ts`** — `locales`, `defaultLocale` (`pt-BR`), `LOCALE_STORAGE_KEY`, `isLocale`.
- **`src/lib/i18n/messages-loader.ts`** — `loadMessages(locale)` (dynamic import dos JSON).
- **`src/lib/i18n/format-message.ts`** — `formatMessage` (`{var}`) e `getMessageValue` por path com ponto.
- **`src/lib/i18n/document-labels.ts`** — `buildDocumentLabels`, `buildSerializationLabels`, `buildPdfChromeLabels` e tipos (`DocumentBuildLabels`, `DocumentSerializationLabels`, `PdfChromeLabels`).
- **`src/lib/i18n/option-labels.ts`** — `getOptionLabel(messages, category, key)` para opções cujo nome tem espaços (ex.: países), evitando lookup só por path com pontos.
- **`src/components/i18n/locale-switcher.tsx`** — select pt-BR / `en`; **montado em `site-header.tsx`** ao lado do theme toggle.

### Schema e documento canônico

- **`src/lib/character-form/schema.ts`** — `createCharacterFormSchema(validation)`, `defaultSchemaBundle`, `ValidateStepContext` / `validateStepValues` com contexto opcional. Export legado: `characterFormSchema`, `stepSchemas` = pt-BR.
- **`src/lib/character-form/steps.ts`** — **Só estrutura:** cada passo tem `id` + `indexLabel` (1–7). **Sem** `title` / `description` no código; textos vêm de `messages.steps.<id>` no UI (quando ligado).
- **`src/lib/character-form/document-sections.ts`** — `buildCharacterDocument(values, labels?)` com labels; default interno = pt-BR.

### Serialização e PDF (API nova; wiring incompleto)

- **`document-markdown.ts`** — `characterDocumentToMarkdown(doc, labels?)` com `DocumentSerializationLabels` (título vazio, “por jogador”, heading de nota). Default = labels derivados de `pt-BR.json` se omitido.
- **`document-plain-text.ts`** — `characterDocumentToPlainText(doc, labels?)` — mesma ideia.
- **`document-filename.ts`** — `slugifyBasenameFromName(name, emptyBasename?)` e `characterDocument*Filename(doc, emptyBasename?)` para basename vazio por locale.
- **`document-pdf.tsx`** — `CharacterDocumentPdf` exige prop **`chrome: PdfChromeLabels`**; `<Document language={chrome.documentLanguage}>`.
- **`generate-character-pdf.ts`** — `generateCharacterPdfBlob(doc, chrome)`.

- **PDF / Markdown / TXT:** botões usam `useIntl`, `buildCharacterDocument(..., documentLabels)`, serializers com labels onde aplicável, `generateCharacterPdfBlob(doc, chrome)`, `t("filename.emptyBasename")` nos filenames, textos de botão/erro em `export.*`.

### Rotas, provider, shell (já documentado antes)

- **`[locale]`**, `RootLocaleRedirect`, `AppIntlProvider`, home/criar localizados, etc. (ver histórico do branch / `STATE.md`).

### Campos do formulário (T5) — feito nesta continuação

- **`basic-info-fields.tsx`**, **`origin-background-fields.tsx`** (`RhfCountrySelect` com `selectPlaceholder` + `getOptionLabel` para países), **`personality-traits-fields.tsx`** (chips via `getOptionLabel`, intensidade via `document.fearLevels.*`, `common.addBackground` / `common.remove`), **`goals-motivations-fields.tsx`**, **`appearance-fields.tsx`** (nota Hero Forge com token `{heroForgeLink}`; MVP com destaque via `mvpEmphasis`), **`free-notes-fields.tsx`**.
- **`rhf-select-fields.tsx`** — `RhfCountrySelect` exige **`selectPlaceholder`**; rótulos de opção via **`formatOptionLabel`** opcional.

### Testes (T9)

- **`messages-parity.test.ts`**, EN em **`schema.test.ts`**, **`option-labels.test.ts`** (helper), Cypress **`Character form wizard (en)`** em `character-wizard.cy.ts`.

---

## Verificação (2026-04-10)

- **`npm run test:ci`** — 10 arquivos, 55 testes, todos passando.
- **`npm run build`** — OK (rotas `/`, `/pt-BR`, `/en`, `/pt-BR/criar`, `/en/criar`).
- **`NEXT_BASE_PATH=/Meu-Background`** — `npm run build` OK (smoke GitHub Pages).
- **`npm run test:e2e`** — 12/12 specs passando; se a **porta 3000** já estiver em uso por outro `next dev`, o wrapper pode terminar com **exit code 1** no `taskkill` do teardown (falso negativo). Garantir porta livre ou encerrar o servidor órfão antes de rodar E2E.

## O que falta (ordem sugerida)

1. **Commit + merge** — `git add` / commit na branch `feature/m2-f02-i18n-english-support`; merge em `develop` quando aprovado; após merge em `main`, consolidar `STATE.md` se necessário.

2. **Opcional** — Mais asserts E2E em `/en/criar` (steps avançados); filename tests se regras mudarem.

---

## Riscos / notas

- PDF e demais exports passam **`chrome` / labels** corretos; build deve permanecer verde após mudanças nos botões.
- Testes que importam só defaults de markdown/txt continuam válidos (segundo parâmetro opcional = pt-BR).
- **`steps.test.ts`** cobre só `clampStepIndex` / `STEP_COUNT` — não depende de títulos em `FORM_STEPS`.

---

## Comando útil

```bash
git status
git diff
npm run test:ci
npm run build
```
