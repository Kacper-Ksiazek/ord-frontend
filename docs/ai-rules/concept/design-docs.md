# Design rules — one place for UI

All **visual and product UI** guidance for agents lives under **`docs/ai-rules/design/`**. Do not use legacy
`styling/`, `ui-ux/`, or new files under `docs/specs/` (see [`docs/specs/README.md`](../../specs/README.md)).

## Folder layout

```
design/
  foundation/        — tokens, Tailwind, theme, bits-ui, charts
  patterns/          — page shell, forms, lists
  patterns/states/   — loading, empty, error UX (skeleton-first)
  features/          — screen UX tied to one product area
```

| Layer          | Path                      | Examples                                                                     |
| -------------- | ------------------------- | ---------------------------------------------------------------------------- |
| **Foundation** | `design/foundation/`      | `tailwind-conventions.md`, `dark-mode-theming.md`, `bits-ui-primitives.md`   |
| **Patterns**   | `design/patterns/`        | `page-and-section-layout.md`, `forms-and-actions.md`, `lists-and-filters.md` |
| **States**     | `design/patterns/states/` | `loading-empty-error-states.md` — add sibling files here if state UX grows   |
| **Feature UX** | `design/features/`        | `conversation-coach-surfaces.md` — add `features/<feature>-….md` when needed |

Read **foundation** for markup and tokens; **patterns** + **states** for new screens; **features** only for
one-off product behavior.

## Good

```
design/patterns/states/loading-empty-error-states.md — skeleton-first for any feature
design/features/conversation-coach-surfaces.md — session thread vs summary panel
```

## Bad

```
design/patterns/conversation-werdykt-tab-essay.md — belongs in features/ or extend conversation-coach-surfaces.md
docs/specs/new-screen.md — use design/patterns, patterns/states, or design/features instead
```
