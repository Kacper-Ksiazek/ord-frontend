# AI rules vs product specs

Two layers of documentation serve different jobs:

| Location               | Purpose                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs/ai-rules/`       | **How** we write code and **reuse UI patterns**: stack conventions, `ui-ux/` for screens, tests.             |
| `docs/ai-rules/ui-ux/` | **Product UI consistency** — layout, skeletons, lists, coach session, errors (preferred over one-off specs). |
| `docs/specs/`          | **Stable link stubs** or cross-team API notes when needed; prefer `ui-ux/` for screen behavior.              |

Put new screen behavior in `docs/ai-rules/ui-ux/`. Extend an existing ui-ux file before adding
a new top-level doc. Keep `docs/specs/` only when an external doc or ticket already links there.

## Good

```
docs/ai-rules/ui-ux/loading-empty-error-states.md — skeleton-first loading for any feature
docs/ai-rules/ui-ux/conversation-coach-surfaces.md — session thread vs summary panel
```

## Bad

```
docs/specs/long-screen-copy.md — full UX duplicated outside ui-ux
docs/ai-rules/svelte/werdykt-tab-essay.md — product copy in the wrong category
```
