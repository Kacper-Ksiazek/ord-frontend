# Conversations list (`features/conversations/list`)

**FDD feature:** `src/lib/features/conversations/pages/list`  
**E2E module:** `e2e/features/conversations/list/`

List load, navigation to create flow, and opening an existing conversation session.

| Spec                                          | Scenarios | Plan IDs | Status |
| --------------------------------------------- | --------- | -------- | ------ |
| [00-list-navigation](./00-list-navigation.md) | 3         | E2E-201  | ✅     |

**Page objects:** `ConversationsListPage` (local), `@e2e/conversations/create`, `@e2e/conversations/session`  
**Helpers:** `@e2e/conversations` (`seedConversationViaApi`)  
**Fixture:** `@e2e/shared/fixtures/auth.fixture` (`authenticatedPage`)
