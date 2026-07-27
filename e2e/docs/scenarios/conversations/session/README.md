# Live session (`features/conversations/session`)

**FDD feature:** `src/lib/features/conversations/pages/session`  
**E2E module:** `e2e/features/conversations/session/`

SSE init greeting, chat messaging, resume from list, and back navigation.

| Spec                                    | Scenarios | Plan IDs    | Status |
| --------------------------------------- | --------- | ----------- | ------ |
| [00-live-session](./00-live-session.md) | 4         | E2E-401–404 | ✅     |

**Page objects:** `ConversationSessionPage` (local), `@e2e/conversations/list`  
**Helpers:** `@e2e/conversations` (`seedConversationViaApi`, `waitForConversationMessageCount`)  
**Fixture:** `@e2e/shared/fixtures/auth.fixture` (`authenticatedPage`)
