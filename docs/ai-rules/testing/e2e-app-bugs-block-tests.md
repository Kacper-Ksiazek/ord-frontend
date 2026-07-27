# E2E: app bugs block tests — do not encode workarounds

When implementing or debugging E2E specs, a failing or surprising flow often indicates an **application bug**, not a test gap. Agents must **stop and notify the human developer immediately** — before adding assertions, workarounds, or marking scenarios as done in `e2e/docs/scenarios/`.

Do not write tests that pass only by bypassing broken product behavior (`page.reload()`, extra waits, API-only paths that skip the user journey, etc.). Do not mark scenarios or roadmap phases ✅ in `e2e/docs/scenarios/` until the spec passes on the real user path — see `testing/e2e-scenario-registry.md`.

## When to flag

Stop and report to the developer when any of these apply:

- The user journey fails but a workaround (reload, direct `goto`, manual cache bust) makes the test pass.
- SPA navigation behaves differently from a full page load for the same feature.
- The scenario registry or Jira ticket claims ✅ but the spec does not exercise the described user path.
- You are about to add a comment like "temporary until …" or "bust cache" in a spec.

Report format: **what the user does**, **what should happen**, **what actually happens**, **suspected layer** (app cache, API, routing), and **blocker for which E2E scenario**.

## Good

```
# During ORDUI-54 — resume from list fails without reload
Agent stops before merging the spec and tells the developer:

> BLOCKER: Reopening a conversation from the list shows stale TanStack Query data
> (empty messages → duplicate SSE init error). Full reload fixes it; list → row click does not.
> I will not add `page.reload()` to the E2E spec. Fix route-entry refetch/invalidation first,
> then implement E2E-403 on the real navigation path.

# After the app fix lands
test('reopening a conversation shows prior messages without duplicate AI init', async ({ ... }) => {
  // list → click row → assert messages — no reload
});
```

## Bad

```ts
// Encoding a product bug as the test contract
await conversationsListPage.openConversation(id);
await authenticatedPage.reload(); // bust TanStack Query cache
await conversationSessionPage.waitForUserMessage(1);
```

```md
<!-- Scenario registry -->

| E2E-403 | Resume from list | ✅ implemented |

<!-- Spec only passes with reload — false coverage -->
```

```
# Silently shipping the workaround
git commit -m "test(ORDUI-54): add resume spec"
# Developer never learns about stale cache on reopen
```
