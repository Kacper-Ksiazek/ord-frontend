# Conversations list — filters

**Spec:** `e2e/features/conversations/list/flows/01-list-filters.spec.ts`  
**Plan:** E2E-202 · **Priority:** P1 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend up, `seedConversationsViaApi`  
**PO:** `ConversationsListPage`

| Test                                                | Overview                                                        |
| --------------------------------------------------- | --------------------------------------------------------------- |
| Applies search and type filters and updates URL     | Two seeded rows → filter by search + type → one row, URL params |
| Empty filter results can be cleared to restore list | No-match state → Clear filters CTA → row visible again          |

**Notes:** Filter labels assume English UI (`Small Talk`). Search is debounced; PO waits on URL `search` param.
