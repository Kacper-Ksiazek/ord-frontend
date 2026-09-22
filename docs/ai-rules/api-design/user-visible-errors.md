# User-visible errors for failed requests

When a query or mutation fails, show something the user can act on — not only `console.error`.
Reuse existing patterns: **Paraglide** strings for copy, **`StatusPanel`** (or equivalent) for
full-page/query failures, inline field errors for forms.

- Prefer i18n keys for headers and fallbacks; use `error.message` from the API only when it is
  safe to show (list/session screens already follow this pattern).
- Offer **retry** where TanStack Query exposes `refetch()` on list/session loads.
- Keep technical detail in the console or devtools; do not stack raw stack traces in the UI.

## Good

```svelte
{#if conversationsQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.conversation.list.load_error.header']()}
		description={conversationsQuery.error?.message ||
			m['features.conversation.list.load_error.description_fallback']()}
		primaryButton={{
			label: m['features.conversation.list.load_error.try_again'](),
			onClick: () => conversationsQuery.refetch()
		}}
	/>
{/if}
```

## Bad

```svelte
{#if conversationsQuery.isError}
	<p>Something went wrong</p>
{/if}
<!-- hard-coded English, no retry, silent failure in production -->
```
