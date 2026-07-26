# Conversations list (`02-conversations`)

**FDD feature:** `src/lib/features/conversations/` (list page)

List load, navigation to create flow, and opening an existing conversation session.

| Spec                                          | Scenarios | Plan IDs | Status |
| --------------------------------------------- | --------- | -------- | ------ |
| [00-list-navigation](./00-list-navigation.md) | 3         | E2E-201  | ✅     |

**Page objects:** `ConversationsListPage`, `CreateConversationPage`, `ConversationSessionPage`  
**Helpers:** `conversations/conversations.ts` (`seedConversationViaApi`)  
**Fixture:** `auth.fixture` (`authenticatedPage`)
