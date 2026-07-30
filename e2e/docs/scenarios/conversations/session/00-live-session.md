# Live session

**Spec:** `e2e/features/conversations/session/flows/00-live-session.spec.ts`  
**Plan:** E2E-401–404 · **Priority:** P0 · **Fixture:** `authenticatedPage`

**Requires:** auth env, AI STUB, `seedConversationViaApi`  
**PO:** `ConversationSessionPage`, `ConversationsListPage`

| Test                                                                    | Overview                                             |
| ----------------------------------------------------------------------- | ---------------------------------------------------- |
| Shows AI greeting after SSE init and enables the composer               | Seeded conv; `ai-message-0` + composer enabled       |
| User message appears and AI replies via SSE stream                      | Send → `user-message-0`, `ai-message-1`              |
| Reopening a conversation shows prior messages without duplicate AI init | List → reopen; prior messages, no duplicate greeting |
| Session back button navigates to conversations list                     | Back → `/conversations`, list loads                  |

**Notes:** `waitForAiMessageContent` ignores „Myśli…” placeholder; indices = full `messages[]` array; timeouts 90–120s.
