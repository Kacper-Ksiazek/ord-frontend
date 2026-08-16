# Conversations list — filters

**Spec:** `e2e/features/conversations/list/flows/01-list-filters.spec.ts`  
**Plan:** E2E-202 · **Priority:** P1 · **Fixture:** `authenticatedPage`

**Requires:** auth env, backend up, `seedConversationsViaApi`  
**PO:** `ConversationsListPage`

| Test                                                | Overview                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Applies search and type filters and updates URL     | Unique seeded rows → filter by search token + type → Alpha row visible, Beta hidden, URL params |
| Empty filter results can be cleared to restore list | No-match state → empty-state Clear filters CTA → seeded row visible again                       |

**Notes:** Search is debounced; PO waits on URL `search` param. Type filter uses option test ids, not English labels. Empty-state CTA is `conversations-no-matches` (not the toolbar clear icon). Do not assert exact list length — serial e2e user (`workers: 1`) has leftover conversations (ORDUI-58).
