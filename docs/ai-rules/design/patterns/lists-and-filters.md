# Lists and filters

List screens combine **filters in the URL or local state**, a **toolbar** under the page title, and
a scrollable list inside the same **`ContentCard`** as the header. Follow conversations list and
words inbox for density and spacing.

## List rows

- Rows sit in sections with optional **group headings** (see recency sections below).
- Use existing row components or cards (`border-line`, `rounded-[10px]`, hover `bg-accent-soft`) —
  match conversations list / words inbox rather than table markup unless the design already uses tables.
- **Loading:** section-level or list-level **skeleton** rows — never `Loader` for new work
  ([`loading-empty-error-states.md`](./states/loading-empty-error-states.md)).

## Filters

- Conversations: filter state synced to query string where bookmarking matters; respect
  `afterNavigate` / `replaceState` patterns already documented in list screen code.
- Filter controls use shared inputs and chips; labels from i18n.

## Recency grouping (conversations list)

Chat-style sections (**Today**, **Yesterday**, **This week**, **This month**, **Later**):

- **UI:** headings from i18n; stable enum tokens from API when `recencyBucket` is present on each
  row (`TODAY`, `YESTERDAY`, `THIS_WEEK`, `THIS_MONTH`, `LATER`).
- **Client fallback:** `src/lib/utils/group-by-recency-section.ts` (Monday-based week, local browser
  time) until the API field fully replaces client grouping.
- **Sort:** list order stays **activity descending**; buckets are display grouping only.

### Backend alignment (when extending API)

Activity instant: `updatedAt`, fallback `createdAt`. Bucket rules (local calendar or documented UTC
policy): today → yesterday → same ISO week (Mon start, before today, not yesterday) → same month
before that week’s Monday → `LATER`. Optional `?timezone=IANA` is a product/API decision; document
if added. i18n of section **titles** stays frontend-only.

## Good

```svelte
{#if conversationsQuery.isPending}
	<ConversationListSkeleton />
{:else}
	{#each groupedSections as section}
		<h2 class="heading-5 text-ink-muted">{section.label}</h2>
		<ul><!-- rows --></ul>
	{/each}
{/if}
```

## Bad

```svelte
{#if conversationsQuery.isPending}
	<Loader />
{/if}
<!-- regrouping logic duplicated inline with different week start than group-by-recency-section -->
```
