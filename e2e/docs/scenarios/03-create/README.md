# Create conversation (`03-create`)

**FDD feature:** `src/lib/features/conversations/` (create page, 4-step wizard)

Type → tone → topic → summary, validation, back navigation, and session start.

| Spec                                                  | Scenarios | Plan IDs         | Status |
| ----------------------------------------------------- | --------- | ---------------- | ------ |
| [00-create-conversation](./00-create-conversation.md) | 3         | E2E-301, E2E-303 | ✅     |

**Page objects:** `CreateConversationPage`, `ConversationSessionPage`  
**Helpers:** `create-conversation-storage.ts` (clears localStorage defaults)  
**Fixture:** `auth.fixture` (`authenticatedPage`)
