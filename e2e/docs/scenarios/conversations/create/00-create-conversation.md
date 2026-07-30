# Create conversation

**Spec:** `e2e/features/conversations/create/flows/00-create-conversation.spec.ts`  
**Plan:** E2E-301, E2E-303 · **Priority:** P0/P1 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend up (AI stub), `gotoFresh()` clears localStorage defaults  
**PO:** `CreateConversationPage`, `ConversationSessionPage`

| Test                                                                        | Overview                                                        |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Completes all steps and opens the new session                               | Full wizard → summary → start → session page (90s timeout)      |
| Next stays disabled until type, tone, and topic are selected                | Each step blocks Next until selection; Start visible on summary |
| Previous returns through steps with selections intact and start still works | Back through wizard; selections kept; start still works         |

**Notes:** PO uses `evaluate(click)` for stepper/cards; `waitForSummaryReady()` waits for regenerate interlocutor test id.
