# E2E: new user-facing flows need a journey

When a PR adds a **new user path** (modal, query deep link such as `?modal=…`, new screen, or visible SSE-driven flow), add a matching spec under `e2e/journeys/` — **prefer the same PR** as the feature. A follow-up PR is acceptable only when the e2e stack is blocked; link it in the feature PR (Jira if deferred) and land it immediately after — do not defer journeys indefinitely.

Each journey exercises the path end-to-end (auth fixtures, page objects, `getByTestId` from the feature’s `testing/test-ids`), not micro UI assertions (those belong in Vitest). For modals tied to URL state, cover at least: open (control and/or deep link), close (param removed), coexisting list filters unchanged, and a minimal happy path (mock SSE/API consistent with other feature e2e patterns).

**Automatic test loop:** unit tests via `make ci` plus the blocking CI **`e2e`** job on PRs. A shipped flow without a journey is manually testable only and outside the regression loop.

See also [`dev/ci-verify-before-done.md`](../dev/ci-verify-before-done.md) for running e2e locally before merge, and [`e2e-tests-playwright.md`](e2e-tests-playwright.md) for layout and fixtures.

## Good

```ts
// Feature PR adds explain popover + test ids → same PR (or linked follow-up) adds:
// e2e/journeys/05-explain-phrase-journey.spec.ts
// using page objects + E2E_TEST_IDS from the feature
```

## Bad

```ts
// Feature PR ships modal + URL helpers with Vitest only — no e2e/journeys/* spec (regression gap)

// Deferred e2e with no Jira link and no immediate follow-up PR
```
