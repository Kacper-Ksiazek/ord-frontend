# Proportionality for a one-person project

ORD balances **strict conventions** (FDD, naming, API contract) with **fast iteration** — see
[`concept/project-brief.md`](../concept/project-brief.md). Follow existing patterns; avoid extra
layers that do not pay off at this scale.

Prefer the simplest change that still fits the rule files. Skip optional work unless the task
or the user asks for it: speculative abstractions, Storybook for one-off screens, broad refactors
“while you are here”, and tests that only restate obvious behavior.

## Good

```
Task: fix filter URL sync on the conversation list.
→ Change the list state module and run make ci.
→ Do not extract a generic “URL sync framework” in $lib.
```

```
Task: add a util with branching edge cases.
→ Colocated Vitest with the test-utils describe structure (see testing/unit-tests-vitest.md).
```

## Bad

```
Task: tweak button padding.
→ Add Storybook stories for every variant “for completeness” without being asked.
→ Introduce a new shared hook used once.
```
