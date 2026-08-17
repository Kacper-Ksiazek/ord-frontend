# E2E: app bugs block tests — do not encode workarounds

When implementing or debugging E2E journeys, a failing or surprising flow often indicates an **application bug**, not a test gap. Agents must **stop and notify the human developer immediately** — before adding assertions, workarounds, or marking journeys as done.

Do not write tests that pass only by bypassing broken product behavior (`page.reload()`, extra waits, API-only paths that skip the user journey, etc.).

## When to flag

Stop and report to the developer when any of these apply:

- The user journey fails but a workaround (reload, direct `goto`, manual cache bust) makes the test pass.
- SPA navigation behaves differently from a full page load for the same feature.
- You are about to add a comment like "temporary until …" or "bust cache" in a spec.

Report format: **what the user does**, **what should happen**, **what actually happens**, **suspected layer** (app cache, API, routing).

## Good

```
Agent stops before merging the journey and tells the developer:

> BLOCKER: Reopening a conversation from the list shows stale data.
> Full reload fixes it; list → row click does not.
> I will not add `page.reload()` to the E2E spec. Fix the app first.
```

## Bad

```ts
// Encoding a product bug as the test contract
await conversationsListPage.openConversation(id);
await authenticatedPage.reload();
await conversationSessionPage.waitForUserMessage(1);
```
