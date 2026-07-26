# Live session

- **Spec:** `e2e/flows/04-session/00-live-session.spec.ts`
- **Feature:** `conversations` (session page)
- **Module:** `04-session`
- **Plan IDs:** E2E-401, E2E-402, E2E-403, E2E-404
- **Status:** implemented

---

### Shows AI greeting after SSE init and enables the composer

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Open a new API-seeded conversation; wait for `ai-message-0` with non-empty content after SSE init; message composer becomes enabled.
- **Prerequisites:** Auth env; backend with AI STUB; empty conversation via `seedConversationViaApi`
- **Page objects:** `ConversationSessionPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ⚠️ Partial overlap with create happy path (both land on session page)

### User message appears and AI replies via SSE stream

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** After AI greeting, type in composer and send → `user-message-0` visible; wait for `ai-message-1` with content.
- **Prerequisites:** Auth env; completed SSE init
- **Page objects:** `ConversationSessionPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### Reopening a conversation shows prior messages without duplicate AI init

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Exchange messages, return to list, reopen same row — prior messages visible; exactly two AI messages (no duplicate init greeting).
- **Prerequisites:** Auth env; backend persists messages
- **Page objects:** `ConversationSessionPage`, `ConversationsListPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### Session back button navigates to conversations list

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** From session after greeting, click back → `/conversations` with list loaded.
- **Prerequisites:** Auth env; open conversation
- **Page objects:** `ConversationSessionPage`, `ConversationsListPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

## Notes

- `waitForAiMessageContent` polls until text is non-empty and not the "Myśli…" loading placeholder.
- Message `data-testid` indices follow the **full** `messages[]` array (`ai-message-0`, `user-message-1`, `ai-message-2`, …).
- Resume test reloads the page after list navigation to avoid stale TanStack Query cache on reopen.
- Describe-level timeout 90–120s for SSE streams (STUB AI).
