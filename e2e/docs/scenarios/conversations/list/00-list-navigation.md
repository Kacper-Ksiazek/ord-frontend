# Conversations list — navigation

**Spec:** `e2e/features/conversations/list/flows/00-list-navigation.spec.ts`  
**Plan:** E2E-201 · **Priority:** P0 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend up, `seedConversationViaApi`  
**PO:** `ConversationsListPage`, `CreateConversationPage`, `ConversationSessionPage`

| Test                                                            | Overview                                           |
| --------------------------------------------------------------- | -------------------------------------------------- |
| Authenticated user sees heading, filters, and conversation rows | Seeded row visible with filters bar                |
| New conversation button opens the create flow                   | New button → `/conversations/create`, wizard loads |
| Clicking a row opens the conversation session                   | Row click → `/conversations/:id`, session loads    |

**Notes:** Row-open scenario ⚠️ overlaps create happy path (different entry point, same destination).
