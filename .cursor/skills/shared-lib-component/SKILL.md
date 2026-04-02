---
name: shared-lib-component
description: >-
  Designs and implements reusable Svelte components under src/lib/components for
  app-wide use: requirements interview, TypeScript prop contracts, folder layout,
  and Storybook grid showcase. Use when the user wants a new shared component,
  a lib/components primitive, design-system building block, or widely reused UI
  in $lib/components.
---

# Shared lib component (plan-first workflow)

This skill applies to **general-purpose components** meant for reuse across features: they live under `src/lib/components/<category>/<component-name>/`, not under feature folders.

## 0. Plan mode is mandatory

**Do not** run implementation steps (writing component files, stories, or large refactors) until the session is in **Plan mode**.

1. **If Plan mode is available**, switch to it before discovery and planning (e.g. use the editor’s Plan mode so requirements and the typed contract are agreed before code).
2. **If you are not in Plan mode and cannot switch**, stop immediately. Tell the user clearly: this workflow is defined to run in **Plan mode** so requirements and the public TypeScript contract are settled before any files are created. Ask them to enable Plan mode and re-invoke the skill or confirm when ready. **Do not** silently continue with coding.

Discovery, interview questions, and presenting the props/types plan are allowed while clarifying mode—but **no new component implementation or Storybook files** until Plan mode is active or the user has explicitly enabled it and asked to proceed.

---

## 1. Requirements interview (resolve ambiguity first)

Conduct a structured conversation until these are explicit or consciously defaulted. Do not assume; ask when unclear.

| Area | What to nail down |
|------|-------------------|
| **Purpose** | What problem does the component solve? Who consumes it (pages, features, other components)? |
| **Placement** | Which existing `lib/components` group fits (e.g. `buttons/`, `cards/`, `forms/`, `navigation/`, `utils/`)? If none fit, agree on a **new** kebab-case group folder name. |
| **API surface** | Required vs optional props; events/callbacks; `Snippet` shapes only (Svelte 5—do not use deprecated slots); `class` / style extension pattern. |
| **Variants & states** | Visual variants (enum), disabled/loading/error, controlled vs uncontrolled if relevant. |
| **A11y** | Roles, labels, keyboard behavior, focus—especially for interactive or composite UIs. |
| **Data & i18n** | User-visible strings: props vs parent; any formatting (dates, numbers). |
| **Dependencies** | Existing primitives only vs new deps; alignment with Tailwind/design tokens already in the repo. |
| **Naming** | Kebab-case folder and file names matching project patterns (e.g. `icon-card/icon-card.svelte`). |

Summarize agreed decisions in a short bullet list before the typed plan.

---

## 2. Typed plan (user approval before code)

Produce a **plan document** in the chat (not necessarily a repo file) that includes:

1. **Primary props interface** — e.g. `export interface MyComponentProps { ... }` extending the right DOM base (`HTMLAttributes<...>`) when wrapping native elements; use `Snippet<...>` types where Svelte snippets are used.
2. **All auxiliary types in the same contract** — unions for variants, small helper interfaces, string-literal unions or `as const` maps where enums would be used; export names that match `index.ts` re-exports.
3. **File list** — exact paths under `src/lib/components/<category>/<name>/` for `.svelte`, `.types.ts`, optional `constants.ts`, `components/` or internal utilities, `index.ts`, `.stories.svelte`.

**Wait for explicit user approval** of this plan. Revise if they change scope.

---

## 3. Implementation (after approval)

1. **Location**: Always `src/lib/components/<category>/<kebab-component-name>/`.
2. **Folder contents** (adjust names to match the component):
   - `<name>.svelte` — implementation.
   - `<name>.types.ts` — props + auxiliary types (single source of truth for the public API).
   - `index.ts` — export default component and public types (mirror `src/lib/components/cards/icon-card/index.ts`).
   - Optional: `<name>.constants.ts` for variant maps / labels; **`components/`** for private subcomponents; small **`*.ts`** utilities colocated if needed.
3. **Quality**: Match existing components’ patterns (TypeScript, Tailwind, Svelte 5 runes). For Svelte work, follow the project’s Svelte skills / MCP guidance when editing `.svelte` files.
4. **Scope**: Only what the plan covers—no unrelated refactors.

---

## 4. Storybook

Add `<name>.stories.svelte` next to the component.

- Use `@storybook/addon-svelte-csf` and existing decorators if the codebase does (see other `*.stories.svelte` files).
- **Preferred**: **One** primary story that renders **multiple use cases in a responsive grid** (e.g. Tailwind `grid` with gaps) so customization and variants are obvious at a glance—additional stories only if needed for edge cases.

---

## 5. Completion checklist

- [ ] Plan mode respected; user approved the typed contract.
- [ ] Types live in `<name>.types.ts` and are exported via `index.ts`.
- [ ] Component folder under `src/lib/components/...` is complete with internals only where needed.
- [ ] Storybook demonstrates several cases (grid story preferred).
- [ ] `bun run check` (or project-standard check) passes for touched files.
