# Build on flowbite-svelte primitives

The design system is based on flowbite-svelte: use its components (`Dropdown`, `DropdownItem`, `Badge`, `Tooltip`, `Spinner`, etc.) instead of hand-rolling equivalents, and its styles are compiled via `@source "../node_modules/flowbite-svelte/dist"` plus `@plugin 'flowbite/plugin'` in `src/app.css`. Customize them with the `class` prop merged via `cn`, and prefer the repo's own wrappers (e.g. `$lib/components/buttons/button`, `$lib/components/forms/input`) where they exist rather than styling flowbite components ad hoc.

## Good

```svelte
<script lang="ts">
	import { Badge, cn, Spinner } from 'flowbite-svelte';
	import { Button } from '$lib/components/buttons/button';

	let { loading = false, class: className = '' }: Props = $props();
</script>

<Badge class={cn('shrink-0', className)} color="primary">New</Badge>

<Button variant="PRIMARY" onClick={handleSave}>
	{#if loading}
		<Spinner size="4" />
	{/if}
	Save
</Button>
```

## Bad

```svelte
<!-- reimplementing primitives flowbite-svelte already provides -->
<span class="rounded-sm bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">New</span>

<div class="custom-spinner"></div>

<style>
	.custom-spinner {
		border: 2px solid #ccc;
		border-top-color: #0ea5e9;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
</style>
```
