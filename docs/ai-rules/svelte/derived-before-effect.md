# Prefer `$derived` over `$effect` for computed state

When a value is fully determined by props, store fields, or other reactive inputs, express it with
`$derived` or `$derived.by()`. Reserve `$effect()` for side effects: DOM measurements, subscribing
to external sources, logging, or synchronizing with non-Svelte APIs — not for copying props into
local state.

## Good

```svelte
<script lang="ts">
	let { items, filter }: Props = $props();

	const visibleItems = $derived(items.filter((item) => item.matches(filter)));

	const total = $derived.by(() => visibleItems.reduce((sum, i) => sum + i.score, 0));
</script>
```

```svelte
<script lang="ts">
	$effect(() => {
		const controller = new AbortController();
		subscribeToStream(id, controller.signal);
		return () => controller.abort();
	});
</script>
```

## Bad

```svelte
<script lang="ts">
	let { value }: Props = $props();
	let doubled = $state(0);

	$effect(() => {
		doubled = value * 2;
	});
</script>
```
