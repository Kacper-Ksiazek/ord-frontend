# Design rules — one place for UI

All **visual and product UI** guidance for agents lives in **`docs/ai-rules/design/`** (tokens, Tailwind,
components, layouts, loading states, lists, feature-specific screen notes). Do not split the same topic across
`styling/`, `ui-ux/`, or `docs/specs/` — those paths are merged or legacy.

## Inside `design/`

| Layer          | Files (examples)                                                                                                             | When to read                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Foundation** | `class-merging-with-cn.md`, `tailwind-conventions.md`, `dark-mode-theming.md`, `bits-ui-primitives.md`, `tanstack-charts.md` | Markup, tokens, theme, primitives, charts                                    |
| **Patterns**   | `page-and-section-layout.md`, `loading-empty-error-states.md`, `forms-and-actions.md`, `lists-and-filters.md`                | New screens, skeletons, forms, lists                                         |
| **Feature UX** | `conversation-coach-surfaces.md`                                                                                             | One feature’s screen split (extend this file or add `design/<feature>-….md`) |

Add a new **pattern** before inventing per-screen docs. Add a **feature UX** file only when behavior is tied to
one product area and would rot inside a generic pattern.

## Good

```
docs/ai-rules/design/loading-empty-error-states.md — skeleton-first for any feature
docs/ai-rules/design/conversation-coach-surfaces.md — session thread vs summary panel
```

## Bad

```
docs/specs/my-screen.md — duplicates design/ (use design/ or extend an existing pattern)
docs/ai-rules/styling/… or ui-ux/… — removed; use design/
```
