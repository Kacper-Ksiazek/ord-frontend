# Create conversation (`features/conversations/create`)

**FDD feature:** `src/lib/features/conversations/pages/create`  
**E2E module:** `e2e/features/conversations/create/`

Type → tone → topic → summary, validation, back navigation, and session start.

| Spec                                                  | Scenarios | Plan IDs         | Status |
| ----------------------------------------------------- | --------- | ---------------- | ------ |
| [00-create-conversation](./00-create-conversation.md) | 3         | E2E-301, E2E-303 | ✅     |

**Page objects:** `CreateConversationPage` (local), `@e2e/conversations/session`  
**Helpers:** `create/helpers/create-conversation-storage.ts` (clears localStorage defaults)  
**Fixture:** `@e2e/shared/fixtures/auth.fixture` (`authenticatedPage`)
