# Conversations list — filters

**Spec:** `e2e/features/conversations/list/flows/01-list-filters.spec.ts`  
**Plan:** E2E-202 · **Priority:** P1 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend up, `seedConversationsViaApi`  
**PO:** `ConversationsListPage`

| Test                                                | Overview                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Applies search and type filters and updates URL     | Unique seeded rows → filter by search token + type → Alpha row visible, Beta hidden, URL params |
| Empty filter results can be cleared to restore list | No-match state → empty-state Clear filters CTA → seeded row visible again                       |

**Notes:** Filter labels assume English UI (`Small Talk`). Search is debounced; PO waits on URL `search` param. Do not assert exact list length — the serial e2e user (`workers: 1`) already has leftover conversations from earlier specs (ORDUI-58).
