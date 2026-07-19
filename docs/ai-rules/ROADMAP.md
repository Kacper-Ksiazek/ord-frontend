# AI Rules Roadmap

Living knowledge snapshot for `docs/ai-rules/`. Update this file when the repo's stack or
structure changes materially, and use the checkboxes to track rule coverage.

## Detected stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes), Vite 7, adapter-vercel
- **Language:** TypeScript (strict, `typescript-eslint` strict config)
- **Styling:** Tailwind CSS 4, flowbite-svelte (+ `cn` helper), lucide-svelte icons
- **Data:** TanStack Svelte Query 6, axios-based `src/lib/api-client` (`http*` naming), rxjs (SSE)
- **API contract:** `@kacper-ksiazek/ord-api-types` package
- **i18n:** Paraglide JS 2 (pl/en/de), `messages/` + `scripts/aggregate-translations.ts`
- **Testing:** Vitest (unit, colocated `.test.ts`), Playwright (`e2e/` with fixtures/flows/pages), Storybook 10 (`.stories.svelte`)
- **Tooling:** ESLint 9 flat config, Prettier, husky + lint-staged, bun
- **Architecture:** FDD — `src/lib/features/{auth,conversations,app-layouts}` with public
  barrels, aliases `$auth`/`$conversations`/`$appLayouts`, thin routes, shared design system
  in `$lib/components` + `$lib/utils`

> Note: the former `docs/API_STRUCTURE_GUIDELINES.md` and
> `docs/COMPONENT_CREATION_GUIDELINES.md` were migrated into the `api-design/`, `general/`,
> `svelte/`, and `styling/` rule categories and deleted.

## Categories

### general/ — architecture & boundaries

Covers: `src/lib/features/*`, `svelte.config.js` aliases, `src/routes`, `src/lib` shared code.

- [x] FDD feature boundaries (no shared → feature imports, cross-feature via barrels)
- [x] Path aliases usage (`$auth`, `$conversations`, `$appLayouts`, `$lib`)
- [x] Thin routes (routes are wrappers over feature page barrels)
- [x] Shared vs feature placement (single-consumer ≠ feature ownership)
- [x] Feature internal structure (pages/, shared/, root barrel)

### typescript/ — language conventions

Covers: `src/**/*.ts`, `tsconfig.json`, `eslint.config.js`.

- [x] File naming (kebab-case, `.svelte.ts` for runes modules)
- [x] Naming conventions (`use-*-mutation`, `http*`, AI acronym casing)
- [x] Type imports and API types from `@kacper-ksiazek/ord-api-types`
- [x] Enum/constants patterns (`enum-values.ts` style)

### svelte/ — components

Covers: `src/lib/components`, `src/lib/features/**/components`.

- [x] Svelte 5 runes usage ($state, $derived, $props, $effect)
- [x] Component folder layout (folder + index.ts barrel + stories)
- [x] Props typing and defaults (+ types files, sub-components, component stores)
- [x] Snippets, file naming, colocated stories
- [x] Local snippets for complex conditional/looped markup

### styling/ — Tailwind & theming

Covers: `src/app.css`, `src/lib/styles`, `src/lib/stores/theme.svelte.ts`, component classes.

- [x] `cn` from flowbite-svelte (never clsx), class merging
- [x] Theme (dark/light) handling patterns
- [x] Tailwind 4 conventions used in the repo
- [x] flowbite-svelte component usage

### api-design/ — API client & data fetching

Covers: `src/lib/api-client`, feature `api-client/` + `services/` dirs.

- [x] `http*` function conventions (naming, axios usage, one file per endpoint)
- [x] TanStack Query usage (queries, `use-*-mutation` files, key factories)
- [x] Services layer (SSE/streaming logic out of components) + SSE stream callers
- [x] API types from generated schema + barrel export conventions

### state/ — stores & state

Covers: `src/lib/stores`, feature `stores/`, `state/`, `contexts/` dirs.

- [x] `.svelte.ts` store patterns (class-based runes stores)
- [x] stores/ vs state/ vs contexts/ naming conventions
- [x] localStorage integration (`local-storage.ts` keys)

### i18n/ — translations

Covers: `messages/`, `scripts/aggregate-translations.ts`, `src/lib/paraglide` (generated), `vite.config.ts`.

- [x] Paraglide message usage in components
- [x] Adding new messages (source structure, aggregation script, pl/en/de parity)
- [x] Generated code hygiene (`src/lib/paraglide` is output, never edited)

### testing/ — unit, e2e, stories

Covers: `src/**/*.test.ts`, `e2e/`, `src/**/*.stories.svelte`, `vite.config.ts`, `.claude/skills/test-utils`.

- [x] Vitest unit test conventions (colocated, utils-focused)
- [x] Playwright e2e structure (fixtures/flows/pages)
- [x] Storybook stories conventions

### git/ — workflow

Covers: git history, `.husky/`, `lint-staged` config, `docs/jira/`.

- [x] Commit message format (`type(ORDUI-N): summary`)
- [x] PR-per-subtask workflow, branch naming (`ordui-N-slug`)
- [x] Pre-commit hooks (husky + lint-staged, prettier + eslint --fix)

## Progress

- [x] Repo analysis
- [x] Concept brief (`concept/project-brief.md`)
- [x] Category rules (see checkboxes above)
- [x] Pointer files (`.cursor/rules/ai-rules.mdc`, `CLAUDE.md`)
