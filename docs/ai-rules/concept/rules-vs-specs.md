# AI rules vs product specs

Two layers of documentation serve different jobs:

| Location         | Purpose                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `docs/ai-rules/` | **How** we write code: stack conventions, naming, boundaries, tests. Stable patterns agents reuse across tasks. |
| `docs/specs/`    | **What** a feature or screen should do: UX splits, tab names, state fields tied to one product area.            |

Put screen- or feature-specific behavior in `docs/specs/` (or extend an existing spec there).
Keep `docs/ai-rules/` free of copy that goes stale when one UI changes — a short pointer rule
is enough when agents need to know a spec exists.

## Good

```
docs/specs/conversation-session-summary-panel.md  — thread vs side panel responsibilities
docs/ai-rules/svelte/session-summary-panel-vs-thread.md — links to the spec only
```

## Bad

```
docs/ai-rules/svelte/long-werdykt-tab-checklist.md — entire product UX embedded in a global Svelte rule
```
