# Conversations list — navigation

- **Spec:** `e2e/features/conversations/list/flows/00-list-navigation.spec.ts`
- **Feature:** `conversations`
- **Module:** `02-conversations`
- **Plan IDs:** E2E-201
- **Status:** implemented

---

### Authenticated user sees heading, filters, and conversation rows

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** After API-seeded conversation exists, list page shows heading, filter controls, and a row for the seeded conversation ID.
- **Prerequisites:** Auth env; backend running; `seedConversationViaApi` creates test data
- **Page objects:** `ConversationsListPage`
- **Helpers:** `conversations/conversations.ts` (`seedConversationViaApi`)
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### New conversation button opens the create flow

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Clicking "new conversation" navigates to `/conversations/create` and the create wizard loads.
- **Prerequisites:** Auth env; backend running
- **Page objects:** `ConversationsListPage`, `CreateConversationPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### Clicking a row opens the conversation session

- **Feature:** `conversations`
- **Priority:** P0
- **Type:** happy path
- **Overview:** With a seeded conversation, clicking its row opens `/conversations/:id` and the session page loads.
- **Prerequisites:** Auth env; backend running; seeded conversation via API
- **Page objects:** `ConversationsListPage`, `ConversationSessionPage`
- **Helpers:** `seedConversationViaApi`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ⚠️ Partial overlap with create happy path (both end on session page, different entry points)
