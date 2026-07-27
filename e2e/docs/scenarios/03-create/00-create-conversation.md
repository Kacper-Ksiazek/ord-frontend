# Create conversation

- **Spec:** `e2e/flows/03-create/00-create-conversation.spec.ts`
- **Feature:** `conversations` (create page)
- **Module:** `03-create`
- **Plan IDs:** E2E-301, E2E-303
- **Status:** implemented

---

### Completes all steps and opens the new session

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Fresh create flow: select type, tone, topic, wait for AI interlocutor on summary, start conversation, land on session page.
- **Prerequisites:** Auth env; backend running (AI stub); `gotoFresh()` clears localStorage defaults
- **Page objects:** `CreateConversationPage`, `ConversationSessionPage`
- **Helpers:** `create-conversation-storage.ts`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Timeout:** 90s describe-level (AI interlocutor generation)
- **Duplicate check:** ✅ No overlap

### Next stays disabled until type, tone, and topic are selected

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** edge case
- **Overview:** On each wizard step, Next is disabled until the required selection is made; after all steps, Start is visible on summary.
- **Prerequisites:** Auth env; backend running; fresh create state
- **Page objects:** `CreateConversationPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### Previous returns through steps with selections intact and start still works

- **Feature:** `conversations`
- **Priority:** P1
- **Type:** edge case
- **Overview:** After completing type/tone/topic, navigate back through all steps — selections remain, re-advance to summary, start conversation successfully.
- **Prerequisites:** Auth env; backend running; fresh create state
- **Page objects:** `CreateConversationPage`, `ConversationSessionPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ⚠️ Partial overlap with happy path (shares wizard completion, adds back navigation)

## Notes

- Step cards can overlap — PO uses `evaluate(el => el.click())` for Next/Previous/Start and card selection.
- `waitForSummaryReady()` waits for "Regenerate AI interlocutor" button before Start.
