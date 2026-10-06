# Page journey coverage posture

Every route page has a row in [`page-journey-coverage.md`](./page-journey-coverage.md): covered by `e2e/journeys/…`, or deferred with a PR or Jira link. A new page or view updates that table in the same change as the screen. A row with neither a journey nor a link is uncovered and blocks the change.

A new page still follows [`e2e-journey-for-new-user-flows.md`](./e2e-journey-for-new-user-flows.md): ship the journey in the same PR, or name the follow-up PR or Jira in the PR body and in the table.

## Good

```text
| / | home | e2e/journeys/06-home-journey.spec.ts | covered |
| /games | games | ORD-214 | deferred |
```

## Bad

```text
# Home ships. Journeys stay auth, words, conversations, explain. No row, no ticket.
```
