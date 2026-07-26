# Live session (`04-session`)

**FDD feature:** `src/lib/features/conversations/` (session page)

SSE init greeting, chat messaging, resume from list, and back navigation.

| Spec                                    | Scenarios | Plan IDs    | Status |
| --------------------------------------- | --------- | ----------- | ------ |
| [00-live-session](./00-live-session.md) | 4         | E2E-401–404 | ✅     |

**Page objects:** `ConversationSessionPage`, `ConversationsListPage`  
**Helpers:** `conversations/conversations.ts` (`seedConversationViaApi`)  
**Fixture:** `auth.fixture` (`authenticatedPage`)
