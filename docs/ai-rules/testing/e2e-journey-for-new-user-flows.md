# E2E: new user-facing flows need a journey

When a PR adds a **new user path** — a page, a view, a modal, a query deep link such as `?modal=…`, or a visible SSE-driven flow — add a matching spec under `e2e/journeys/` in the **same PR**. A follow-up is allowed only when the e2e stack is blocked. The feature PR body must link that follow-up PR or Jira issue, and [`page-journey-coverage.md`](./page-journey-coverage.md) must name the same link. Do not defer a journey with no link.

Each journey exercises the path end-to-end (auth fixtures, page objects, `getByTestId` from the feature’s `testing/test-ids`), not micro UI assertions (those belong in Vitest). Structure the single `test()` body with **numbered `test.step` blocks** (`'01. …'`, `'02. …'`) — see [`e2e-journey-enumerated-steps.md`](e2e-journey-enumerated-steps.md). For modals tied to URL state, cover at least: open (control and/or deep link), close (param removed), coexisting list filters unchanged, and a minimal happy path (mock SSE/API consistent with other feature e2e patterns).

**Automatic test loop:** unit tests via `make ci` plus the blocking CI **`e2e`** job on PRs. A shipped flow without a journey is manually testable only and outside the regression loop.

See also [`dev/ci-verify-before-done.md`](../dev/ci-verify-before-done.md) for running e2e locally before merge, and [`e2e-tests-playwright.md`](e2e-tests-playwright.md) for layout and fixtures.

## Good

```ts
// Feature PR adds UI + test ids → same PR (or linked follow-up) adds e2e/journeys/NN-<flow>-journey.spec.ts
// One test(), numbered test.step blocks — see e2e-journey-enumerated-steps.md
// Page objects + E2E_TEST_IDS from the feature
```

## Bad

```ts
// Feature PR ships modal + URL helpers with Vitest only — no e2e/journeys/* spec (regression gap)

// New page with no journey, no follow-up PR, and no Jira link
// Deferred e2e whose link is missing from the PR body and from page-journey-coverage.md
```
