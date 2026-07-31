# Create conversation — AI topic suggestions

**Spec:** `e2e/features/conversations/create/flows/01-topic-suggestions.spec.ts`  
**Plan:** E2E-302 · **Priority:** P1 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend topic-suggestion SSE (STUB in e2e stack)  
**PO:** `CreateConversationPage`

| Test                                                       | Overview                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| Generates topic rows and allows proceeding after selection | TOPIC_EXPLORATION → generate topics → select `topic-row-0` → summary step |

**Notes:** Uses types without built-in default topics; relies on AI topic stream completing before Next enables.
